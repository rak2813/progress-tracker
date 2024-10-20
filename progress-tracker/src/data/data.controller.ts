import { Controller, Get, Param } from '@nestjs/common';
import { UUID } from 'crypto';
import { DataService } from './data.service';

@Controller('data')
export class DataController {
    constructor(private readonly dataService: DataService){}

    @Get('exercise/:exerciseId')
    async GetExerciseData(@Param('exerciseId')exerciseId: UUID){
        return this.dataService.GetExerciseData(exerciseId);
    }
}
