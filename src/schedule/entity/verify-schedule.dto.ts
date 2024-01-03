 
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateScheduleDto } from './create-schedule.dto';
import { ScheduleEntity } from './schedule.entity';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, minLength } from 'class-validator';

export class VerifyScheduleDto {
  @ApiProperty()
  @IsString()
  schedule:string
  
}