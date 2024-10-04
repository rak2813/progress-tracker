import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { UserRepository } from './user/user.repository';
import { ExerciseService } from './exercise/exercise.service';
import { ExerciseController } from './exercise/exercise.controller';
import { ExerciseRepository } from './exercise/exercise.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Excercise, ExerciseSchema } from './entities/exercise.entity';
import { SessionService } from './session/session.service';
import { SessionController } from './session/session.controller';
import { SessionRepository } from './session/session.repository';
import { Session, SessionSchema } from './entities/session.entity';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/progress-tracker'),
    MongooseModule.forFeature([
      {name: Excercise.name, schema: ExerciseSchema}, 
      {name: Session.name, schema: SessionSchema}
    ])
  ],
  controllers: [AppController, UserController, ExerciseController, SessionController],
  providers: [AppService, UserService, UserRepository, ExerciseService, ExerciseRepository, SessionService, SessionRepository],
})
export class AppModule {}

