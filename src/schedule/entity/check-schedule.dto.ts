import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CheckScheduleDto {
   

  @ApiProperty()
  @IsOptional()
  schedule?: string;

  @ApiProperty()
  @IsOptional()
  viewEquivalentSchedule?: string[];
  
  @ApiProperty()
  @IsOptional()
  finalWrite?: string;

  @ApiProperty()
  @IsOptional()
  readFrom?: string;

  @ApiProperty()
  @IsOptional()
  viewEquivalentTransaction?: string;

  @ApiProperty()
  @IsOptional()
  transactions?: string;

  @ApiProperty()
  @IsOptional()
  result?: boolean;
}
