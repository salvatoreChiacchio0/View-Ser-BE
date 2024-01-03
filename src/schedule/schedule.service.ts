import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateScheduleDto } from './entity/create-schedule.dto';
import { UpdateScheduleDto } from './entity/update-schedule.dto';
import { Schedule, User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/DTO/user.entity';
import { UserScheduleDTO } from './entity/user-schedule.dto';
import { ViewSerializabilityService } from 'src/view-serializability/view-serializability.service';
import { CheckScheduleDto } from './entity/check-schedule.dto';
import { TestScheduleDto } from './entity/test-schedule.dto';
import { ResponseDto } from './entity/response.dto';

@Injectable()
export class ScheduleService {
  constructor(
    private prisma: PrismaService,
    private viewSerService: ViewSerializabilityService,
  ) {}

  findAll() {
    return this.prisma.schedule.findMany();
  }

  findOne(id: number) {
    return this.prisma.schedule.findUnique({ where: { id } });
  }

  async findManyScheduleNotSolvedByUser(userId: number) {
    const userSchedules = await this.prisma.userSchedule.findMany({
      where: {
        userId: userId,
      },
      select: {
        scheduleId: true,
      },
    });

    const scheduleIds = userSchedules.map(
      (userSchedule) => userSchedule.scheduleId,
    );

    const schedulesWithoutUser = await this.prisma.schedule.findMany({
      where: {
        NOT: {
          id: {
            in: scheduleIds,
          },
        },
      },
    });

    if (schedulesWithoutUser.length === 0) {
      return undefined;
    }

    const randomIndex = Math.floor(Math.random() * schedulesWithoutUser.length);
    return schedulesWithoutUser[randomIndex];
  }
  
  remove(id: number) {
    return this.prisma.schedule.delete({ where: { id } });
  }

  addScheduleToUser(userScheduleDTO: UserScheduleDTO) {
    return this.prisma.userSchedule.create({ data: userScheduleDTO });
  }

 
   async testSchedule(schedule:string,user:User){
      const scheduleSanitized =  await this.viewSerService.sanitizeSchedule(schedule)   
      if(!this.viewSerService.validatedRegex(scheduleSanitized)) return {result:"The schedule is wrong, you have misspelled something?🤔"}
      if(!this.viewSerService.checkDuplicates(schedule)) return {result:"The schedule does not satify the guidelines!"}

      const checkedSchedule:CheckScheduleDto = await this.viewSerService.checkSchedule(scheduleSanitized)
      const scheduleSearch = await this.prisma.schedule.findFirst({where:{schedule:checkedSchedule.schedule}})
      if(!scheduleSearch) {
         await this.prisma.schedule.create(
            {
               data: 
               {
                  schedule:scheduleSanitized,
                  transaction:(checkedSchedule.transactions.split('-').length + 1),
                  view_Serializable:checkedSchedule.result
               }
            }
         )
      }
      if(!await this.getTestedScheduleByUserId(scheduleSearch.id,user.id))await this.addScheduleToUser({userId:user.id,scheduleId:scheduleSearch.id})
      return checkedSchedule
   }

   async getTestedScheduleByUserId(scheduleId:number,id:number){      
         return  await this.prisma.userSchedule.findFirst({where:{scheduleId:scheduleId, userId:id}})      
   }

  async resolveSchedule(scheduleToVerify:TestScheduleDto,user:User){
    let message:ResponseDto = {result:''}     
    let schedule =  await  await this.prisma.schedule.findFirst({where:{schedule:scheduleToVerify.schedule}})
        
     if(schedule.view_Serializable == scheduleToVerify.result){
        if(!await this.prisma.userSchedule.findFirst({where:{userId:user.id,scheduleId:schedule.id}}))await this.addScheduleToUser({userId:user.id,scheduleId:schedule.id})
        message.result = 'Correct!🥳'
        return  message
     }else{
      message.result = 'Wrong😭'
      return  message
     }
  }
}