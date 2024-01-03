import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { PrismaModule } from 'prisma/prisma.module';
import { UsersService } from 'src/users/users.service';
import { ViewSerializabilityService } from 'src/view-serializability/view-serializability.service';

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService,UsersService,ViewSerializabilityService],
  imports: [PrismaModule],
  exports:[ScheduleModule]
})
export class ScheduleModule {}
