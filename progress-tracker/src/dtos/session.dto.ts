import { IsDate, IsDateString, IsNumber, IsString } from "class-validator";

export class SessionDto{
    @IsNumber()
    bodyWeight: number

    @IsString()
    workoutType: string 

    workout: {
        name: string;
        sets: {
          weight: number;
          reps: number;
        }[];
      }[];

      date: Date
}