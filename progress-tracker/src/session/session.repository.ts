import { InjectModel } from "@nestjs/mongoose";
import { UUID } from "crypto";
import { Model } from "mongoose";
import { SessionDto } from "../dtos/session.dto";
import { Session } from "../entities/session.entity";

export class SessionRepository{
    constructor(@InjectModel(Session.name) private readonly sessionModel: Model<Session>){}

    async GetAllSessions() {
        return this.sessionModel.find().sort({date: -1}).exec();
    }

    async GetAllSessionsDates() {
        return this.sessionModel.find().select('date').sort({ date: -1 }).exec();
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

    async DeleteSession(id: UUID) {
        return await this.sessionModel.findByIdAndDelete(id);
    }

}