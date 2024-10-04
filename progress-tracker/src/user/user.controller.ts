import { Controller, Get, Param } from '@nestjs/common';
import { UUID } from 'crypto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService){}

    @Get(':id')
    GetUser(@Param('id')id: UUID){
        return this.userService.GetUser(id);
    }

}