 
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class CreateScheduleDto {
  @ApiProperty()
  schedule: string;

  @ApiProperty()
  transaction: number;
 

  @ApiProperty({ required: false, default: false })
  view_Serializable: boolean = false;

  @ApiProperty()
  user:User
  
}