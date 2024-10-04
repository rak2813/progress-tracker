import { Injectable, NotFoundException } from '@nestjs/common';
import { SessionDto } from '../dtos/session.dto';
import { SessionRepository } from './session.repository';
import { UUID } from 'crypto';

@Injectable()
export class SessionService {
    constructor(private readonly sessionRepository: SessionRepository){}

    async GetAllSessions() {
        return this.sessionRepository.GetAllSessions();
    }

    async GetSessionById(id: UUID) {
        return this.sessionRepository.GetSessionById(id);
    }

    async AddSession(sessionDto: SessionDto) {
        sessionDto.date = new Date(Date.now());
        return this.sessionRepository.AddSession(sessionDto);
    }

    async UpdateSession(id: UUID, sessionDto: SessionDto) {
        var response = await this.sessionRepository.GetSessionById(id);
        if(response==null) throw new NotFoundException("Cannot find session.");

        return this.sessionRepository.UpdateSession(id, sessionDto);
    }

    async GetBodyWeightData() {
        var sessionsList = await this.GetAllSessions();
        var response = [];
        sessionsList.forEach(session => {
            response.push({"date": session.date, "weight": session.bodyWeight});
        });
        return response;
    }


}
