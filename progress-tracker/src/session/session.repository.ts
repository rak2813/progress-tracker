import { InjectModel } from "@nestjs/mongoose";
import { UUID } from "crypto";
import { Model } from "mongoose";
import { SessionDto } from "src/dtos/session.dto";
import { Session } from "src/entities/session.entity";

export class SessionRepository{
    constructor(@InjectModel(Session.name) private readonly sessionModel: Model<Session>){}

    async GetAllSessions() {
        return this.sessionModel.find();
    }

    async GetSessionById(id:UUID){
        return this.sessionModel.findById(id);
    }

    async AddSession(sessionDto: SessionDto) {
        var newSession = new this.sessionModel(sessionDto);
        return newSession.save();
    }

    async UpdateSession(id: UUID, sessionDto: SessionDto) {
        return await this.sessionModel.findByIdAndUpdate(id, sessionDto);
    }

}