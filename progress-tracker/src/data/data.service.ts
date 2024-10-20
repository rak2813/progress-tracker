import { Injectable, NotFoundException } from '@nestjs/common';
import { max } from 'class-validator';
import { UUID } from 'crypto';


import { ExerciseRepository } from 'src/exercise/exercise.repository';
import { SessionRepository } from 'src/session/session.repository';

@Injectable()
export class DataService {
    constructor(private readonly exerciseRepo: ExerciseRepository, private readonly sessionRepo: SessionRepository) {}
    async GetExerciseData(exerciseId: UUID) {
        const exercise = await this.exerciseRepo.GetExerciseById(exerciseId);
        if(exercise == null) throw new NotFoundException("Cannot find exercise.");

        var sessions = (await this.sessionRepo.GetAllSessions()).reverse();
        var exerciseSessions = sessions.filter(session => session.workout.find(workout => workout.name == exercise.name));
        var data: Array<{ date: string, weight: number }> = [];

        exerciseSessions.forEach(session => {
            var workout = session.workout.find(workout => workout.name === exercise.name);
            var sessionMaxWeight = 0;
            
            // Check if workout exists to avoid potential errors
            if (workout) {
                workout.sets.forEach(set => {
                    if (set.weight > sessionMaxWeight) {
                        sessionMaxWeight = set.weight;
                    }
                });
        
                // Push the correct object structure into the data array
                data.push({ date: new Date(session.date as unknown as Date).toDateString(), weight: sessionMaxWeight });
            }
        });
        
        return { name: exercise.name, data };
    }
}
