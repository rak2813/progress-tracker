import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Date, Document } from "mongoose";

@Schema()
export class Session extends Document{
    
    @Prop({ type: Date, required: true })
    date: Date

    @Prop()
    bodyWeight: number

    @Prop()
    workoutType: string 

    @Prop({
        type: [
          {
            name: { type: String, required: true },
            sets: [
              {
                weight: { type: Number, required: true },
                reps: { type: Number, required: true },
              },
            ],
          },
        ],
        required: true,
      })
      workout: {
        name: string;
        sets: {
          weight: number;
          reps: number;
        }[];
      }[];
}
export const SessionSchema = SchemaFactory.createForClass(Session);