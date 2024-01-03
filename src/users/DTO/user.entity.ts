import { ApiProperty } from '@nestjs/swagger';
import { Schedule, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity  implements User{
    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
      }
      
    @ApiProperty()
    id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
  
   @ApiProperty()
   schedule: Schedule[]

  @Exclude()
  password: string;
 
}