import { Test, TestingModule } from '@nestjs/testing';
import { ViewSerializabilityService } from './view-serializability.service';

describe('ViewSerializabilityService', () => {
  let service: ViewSerializabilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViewSerializabilityService],
    }).compile();

    service = module.get<ViewSerializabilityService>(ViewSerializabilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
