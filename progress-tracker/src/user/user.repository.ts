import { Injectable } from "@nestjs/common";
import { UUID } from "crypto";

@Injectable()
export class UserRepository{
    GetUser(id: UUID){}
}