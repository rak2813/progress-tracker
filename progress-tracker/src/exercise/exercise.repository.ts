import { NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UUID } from "crypto";
import { Model } from "mongoose";
import { ExerciseDto } from "../dtos/exercise.dto";
import { Excercise } from "../entities/exercise.entity";

export class ExerciseRepository{
    constructor(@InjectModel(Excercise.name) private readonly exerciseModel: Model<Excercise>){}

    async GetExercises(): Promise<Excercise[]>{
        return await this.exerciseModel.find().sort({name: 1}).exec();
    }

    async GetExerciseByName(name: string): Promise<Excercise>{
        return await this.exerciseModel.findOne({name}).exec();
    }

    async GetExerciseById(id: string): Promise<Excercise>{
        return await this.exerciseModel.findById(id);
    }

    async AddExercise(exerciseDto: ExerciseDto): Promise<Excercise> {
        const newExercise = new this.exerciseModel(exerciseDto);
        return newExercise.save();
    }

    async DeleteExercise(id: UUID): Promise<boolean>{
        return await this.exerciseModel.findByIdAndDelete(id);
    }

    async UpdateExercise(exerciseEntity: Excercise){
        var id = exerciseEntity._id.toString();
        var response = await this.exerciseModel.findById(id);
        if(response==null) throw new NotFoundException("Cannot find exercise.");

        return await this.exerciseModel.findByIdAndUpdate(id, {$set: {
            maxWeight: exerciseEntity.maxWeight,
            maxReps: exerciseEntity.maxReps,
            lastWeight: exerciseEntity.lastWeight,
            lastReps: exerciseEntity.lastReps
        }});
    }
}