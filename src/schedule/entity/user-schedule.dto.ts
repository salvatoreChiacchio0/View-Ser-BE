import { ApiProperty } from "@nestjs/swagger";

export class UserScheduleDTO{
    @ApiProperty()
    userId:number

    @ApiProperty()
    scheduleId:number
}