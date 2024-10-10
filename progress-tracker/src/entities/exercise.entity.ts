import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

@Schema()
export class Excercise extends Document{
    @Prop()
    id: number

    @Prop()
    name: string

    @Prop()
    maxWeight: number

    @Prop()
    maxReps: number

    @Prop()
    lastWeight: number

    @Prop()
    lastReps: number
}
export const ExerciseSchema = SchemaFactory.createForClass(Excercise);

