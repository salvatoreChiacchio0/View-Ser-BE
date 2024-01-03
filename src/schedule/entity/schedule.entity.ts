// src/articles/entities/article.entity.ts8

import { Schedule } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/users/DTO/user.entity';

export class ScheduleEntity implements Schedule {
  @ApiProperty()
  id: number;

  @ApiProperty()
  schedule: string;

  @ApiProperty()
  transaction: number;
 
  @ApiProperty()
  view_Serializable: boolean;
 
  @ApiProperty({ required: false, nullable: true })
  userId: number | null;

  @ApiProperty({ required: false, type: UserEntity })
  user?: UserEntity;

  constructor({ user, ...data }: Partial<ScheduleEntity>) {
    Object.assign(this, data);

    if (user) {
      this.user = new UserEntity(user);
    }
  }
}
