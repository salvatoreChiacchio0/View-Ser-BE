// src/schedule/schedule.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
   import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
 import { CreateScheduleDto } from './entity/create-schedule.dto';
 import { UpdateScheduleDto } from "./entity/update-schedule.dto";

import { ScheduleEntity } from './entity/schedule.entity';
import { ScheduleService } from './schedule.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guardf';
 import { UserEntity } from 'src/users/DTO/user.entity';
import { UsersService } from 'src/users/users.service';
import { Schedule } from '@prisma/client';
import { VerifyScheduleDto } from './entity/verify-schedule.dto';
import { ResponseDto } from './entity/response.dto';
import { TestScheduleDto } from './entity/test-schedule.dto';
import { CheckScheduleDto } from './entity/check-schedule.dto';

@Controller('schedule')
@ApiTags('schedule')
@UseGuards(JwtAuthGuard)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService,private userService:UsersService) {}
 
  @Get('random')
  @ApiOperation({ summary: "Given a random schedule" })
   @ApiOkResponse({ type: ResponseDto })
  @ApiBearerAuth()
  async randomFind(@Request() req : {user:UserEntity}) { 
     let result = (await this.scheduleService.findManyScheduleNotSolvedByUser(req.user.id))
    return result && result.schedule ? {result: result.schedule} : {result:'You completed all the schedule!🥳'}
  }

 
  @Post('test')
  @ApiOperation({ summary: "Given a schedule (series of At(x)) in input it says if it's view-serializable or not and gives the full solution" })
   @ApiOkResponse({ type:CheckScheduleDto })
  @ApiBearerAuth()
  async testSchedule(@Body() verifyScheduleDto : VerifyScheduleDto,@Request() req : {user:UserEntity}) { 
     return  this.scheduleService.testSchedule(verifyScheduleDto.schedule,req.user)
  }
 
  @Post('verify')
  @ApiOperation({ summary: "Given a schedule (series of At(x)) in input and your guess(true if View-Ser, false if not) it says you are correct and give the full solution" })
   @ApiOkResponse({ type: ResponseDto })
  @ApiBearerAuth()
  async verifySchedule(@Body() verifyScheduleDto : TestScheduleDto,@Request() req : {user:UserEntity}) { 
     return  this.scheduleService.resolveSchedule(verifyScheduleDto,req.user)
  }
}

