import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { UserRepository } from './user.repository';
import { SessionRepository } from 'src/session/session.repository';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository, private readonly sessionRepo: SessionRepository){}

    GetUser(id: UUID){
        return this.userRepository.GetUser(id);
    }
    async GetStreak() {
        const sessions = await this.sessionRepo.GetAllSessionsDates();
        const dates = sessions.map(session => session.date as unknown as Date);
        let streak = 0;
        let yDay = new Date(Date.now() - 86400000);
        yDay.setUTCMilliseconds(0);
        yDay.setUTCSeconds(0);
        yDay.setUTCMinutes(0);
        yDay.setUTCHours(0);
        let i=0;
        while(true){
            if (yDay.getUTCDate() === dates[i].getUTCDate()) {
                streak++;
                yDay.setDate(yDay.getDate()-1);
                i++;
            } else {
                break;
            }
        }
        return streak;
    }
}
