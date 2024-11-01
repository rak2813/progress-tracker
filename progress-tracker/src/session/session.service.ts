import { Injectable, NotFoundException } from '@nestjs/common';
import { SessionDto } from '../dtos/session.dto';
import { SessionRepository } from './session.repository';
import { UUID } from 'crypto';
import { ExerciseRepository } from 'src/exercise/exercise.repository';

@Injectable()
export class SessionService {
    constructor(
        private readonly sessionRepository: SessionRepository,
        private readonly exerciseRepository: ExerciseRepository
    ){}

    async GetAllSessions() {
        return this.sessionRepository.GetAllSessions();
    }

    async GetSessionById(id: UUID) {
        return this.sessionRepository.GetSessionById(id);
    }

    async AddSession(sessionDto: SessionDto) {
        sessionDto.date = new Date(Date.now());
        sessionDto.date.setUTCHours(0, 0, 0, 0);
        await this.UpdateExerciseStats(sessionDto);
        return this.sessionRepository.AddSession(sessionDto);
    }

    async UpdateSession(id: UUID, sessionDto: SessionDto) {
        var response = await this.sessionRepository.GetSessionById(id);
        if(response==null) throw new NotFoundException("Cannot find session.");
        await this.UpdateExerciseStats(sessionDto);
        sessionDto.date = new Date(Date.now());
        sessionDto.date.setUTCHours(0, 0, 0, 0);
        return this.sessionRepository.UpdateSession(id, sessionDto);
    }

    async GetBodyWeightData() {
        var sessionsList = await this.GetAllSessions();
        var response = [];
        sessionsList.forEach(session => {
            response.push({"date": session.date, "weight": session.bodyWeight});
        });
        return response;
    }

    async DeleteSession(id: UUID) {
        var response = await this.sessionRepository.GetSessionById(id);
        if(response==null) throw new NotFoundException("Cannot find session.");

        return this.sessionRepository.DeleteSession(id);
    }

    async UpdateExerciseStats(sessionDto: SessionDto) {
        sessionDto.workout.forEach(async workout => {
            // console.log(workout.name);
            var exercise = await this.exerciseRepository.GetExerciseByName(workout.name);
            if(exercise==null) throw new NotFoundException("Cannot find exercise.");

            var sessionMaxWeight = 0;
            var sessionMaxWeightReps = 0;
            workout.sets.forEach(set => {
                if(set.weight > sessionMaxWeight){
                    sessionMaxWeight = set.weight;
                    sessionMaxWeightReps = set.reps;
                }else if(set.weight == sessionMaxWeight && set.reps > sessionMaxWeightReps){
                    sessionMaxWeightReps = set.reps;
                }
            })

            exercise.lastWeight = sessionMaxWeight;
            exercise.lastReps = sessionMaxWeightReps;

            exercise.maxWeight = exercise.maxWeight || 0;
            exercise.maxReps = exercise.maxReps || 0;

            if(sessionMaxWeight > exercise.maxWeight){
                exercise.maxWeight = sessionMaxWeight;
                exercise.maxReps = sessionMaxWeightReps;
            }else if(sessionMaxWeight == exercise.maxWeight && sessionMaxWeightReps > exercise.maxReps){
                exercise.maxReps = sessionMaxWeightReps;
            }
            await this.exerciseRepository.UpdateExercise(exercise);
        });
    }

    // async UpdateAllExerciseStats() {
    //     var sessionsList = await this.GetAllSessions();
    //     var sessionDto = new SessionDto();
    //     sessionsList.forEach(async session => {
    //         sessionDto.bodyWeight = session.bodyWeight;
    //         sessionDto.workoutType = session.workoutType.toString();
    //         sessionDto.workout = session.workout;
    //         sessionDto.date = new Date(session.date.toString());
    //         await this.UpdateExerciseStats(sessionDto);
    //     });
    // }


}
