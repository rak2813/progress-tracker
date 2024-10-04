import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

@Schema()
export class Excercise extends Document{
    @Prop()
    id: number

    @Prop()
    name: string
}
export const ExerciseSchema = SchemaFactory.createForClass(Excercise);

