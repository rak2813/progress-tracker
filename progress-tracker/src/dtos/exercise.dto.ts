import { IsNumber, IsString } from "class-validator"
import { NumberExpression } from "mongoose";

export class ExerciseDto{
    @IsString()
    name: string

    @IsNumber()
    maxWeight: number = 0;

    @IsNumber()
    maxReps: number = 0;

    @IsNumber()
    lastWeight: number = 0;

    @IsNumber()
    lastReps: number = 0;
}
