 
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateScheduleDto } from './create-schedule.dto';
import { ScheduleEntity } from './schedule.entity';
import { IsBoolean, IsNotEmpty, IsNumber, isString } from 'class-validator';

export class TestScheduleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  result:Boolean
  
  @ApiProperty()
  @IsNotEmpty()
  schedule:string
  
}