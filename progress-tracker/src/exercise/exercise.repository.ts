import { NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UUID } from "crypto";
import { Model } from "mongoose";
import { ExerciseDto } from "src/dtos/exercise.dto";
import { Excercise } from "src/entities/exercise.entity";

export class ExerciseRepository{
    constructor(@InjectModel(Excercise.name) private readonly exerciseModel: Model<Excercise>){}

    async GetExercises(): Promise<Excercise[]>{
        return await this.exerciseModel.find().exec();
    }

    async GetExerciseByName(name: string): Promise<Excercise>{
        return await this.exerciseModel.findOne({name}).exec();
    }

    async AddExercise(exerciseDto: ExerciseDto): Promise<Excercise> {
        const newExercise = new this.exerciseModel(exerciseDto);
        return newExercise.save();
    }

    async DeleteExercise(id: UUID): Promise<boolean>{
        return await this.exerciseModel.findByIdAndDelete(id);
    }
}