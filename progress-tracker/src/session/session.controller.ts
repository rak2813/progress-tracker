import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { SessionDto } from '../dtos/session.dto';
import { SessionService } from './session.service';
import { UUID } from 'crypto';

@Controller('session')
export class SessionController {
    constructor(private readonly sessionService: SessionService){}

    @Post()
    async AddSession(@Body() sessionDto: SessionDto){
        return this.sessionService.AddSession(sessionDto);
    }

    @Get()
    async GetAllSessions(){
        return this.sessionService.GetAllSessions();
    }

    @Get(':sessionId')
    async GetSessionById(@Param('sessionId')sessionId: UUID){
        return this.sessionService.GetSessionById(sessionId);
    }

    @Put(':id')
    async UpdateSession(@Param('id')id: UUID, @Body()sessionDto: SessionDto){
        return this.sessionService.UpdateSession(id, sessionDto);
    }

    @Get('body-weight')
    async GetBodyWeightData(){
        return this.sessionService.GetBodyWeightData();
    }
}
