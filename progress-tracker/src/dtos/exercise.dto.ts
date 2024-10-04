import { IsString } from "class-validator"

export class ExerciseDto{
    @IsString()
    name: string
}
