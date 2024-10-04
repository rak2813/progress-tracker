import { IsNumber, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class UserEntity{
    @IsUUID()
    id: UUID

    @IsString()
    firstName: string

    @IsString()
    lastName: string

    @IsNumber()
    age: number

    @IsNumber()
    weight: number
}