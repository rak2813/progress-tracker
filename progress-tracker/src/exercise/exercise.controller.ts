import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UUID } from 'crypto';
import { ExerciseService } from './exercise.service';
import { ExerciseDto } from '../dtos/exercise.dto';

@Controller('exercise')
export class ExerciseController {
    constructor(private readonly exerciseService: ExerciseService){}
    @Get()
    async GetExercises(){
        return await this.exerciseService.GetExercises();
    }

    @Get(':name')
    async GetExerciseByName(@Param('name')name: string){
        return await this.exerciseService.GetExerciseByName(name);
    }
    
    @Post()
    async AddExercise(@Body() exerciseDto: ExerciseDto){
        return await this.exerciseService.AddExercise(exerciseDto);
    }

    @Delete(':id')
    async DeleteExercise(@Param('id')id: UUID){
        return await this.exerciseService.DeleteExercise(id);
    }
}
