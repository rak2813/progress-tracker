import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository){}

    GetUser(id: UUID){
        return this.userRepository.GetUser(id);
    }
}
