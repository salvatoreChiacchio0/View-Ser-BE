import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ScheduleModule } from './schedule/schedule.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { ViewSerializabilityModule } from './view-serializability/view-serializability.module';

@Module({
  imports: [ 
    ConfigModule.forRoot({
    isGlobal: true,  
  }),
  AuthModule,ScheduleModule, ViewSerializabilityModule],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
