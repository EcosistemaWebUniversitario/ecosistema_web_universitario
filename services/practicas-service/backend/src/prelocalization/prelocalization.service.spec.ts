import { Test, TestingModule } from '@nestjs/testing';
import { PrelocalizationService } from './prelocalization.service';

describe('PrelocalizationService', () => {
  let service: PrelocalizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrelocalizationService],
    }).compile();

    service = module.get<PrelocalizationService>(PrelocalizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
