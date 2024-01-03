import { Module } from '@nestjs/common';
import { ViewSerializabilityService } from './view-serializability.service';

@Module({
  providers: [ViewSerializabilityService]
})
export class ViewSerializabilityModule {}
