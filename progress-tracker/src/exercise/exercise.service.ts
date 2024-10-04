import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UUID } from 'crypto';
import { ExerciseRepository } from './exercise.repository';
import { ExerciseDto } from '../dtos/exercise.dto';

@Injectable()
export class ExerciseService {
    constructor(private readonly exerciseRepository: ExerciseRepository){}
    
    async GetExercises(){
        return await this.exerciseRepository.GetExercises();
    }

    async GetExerciseByName(name: string){
        return await this.exerciseRepository.GetExerciseByName(name);
    }

    async AddExercise(exerciseDto: ExerciseDto) {
        var response = await this.exerciseRepository.GetExerciseByName(exerciseDto.name);
        if(response != null) throw new ForbiddenException("Exercise already exists.");
        
        return await this.exerciseRepository.AddExercise(exerciseDto);
    }

    async DeleteExercise(id: UUID){
        return await this.exerciseRepository.DeleteExercise(id);
    }
}
