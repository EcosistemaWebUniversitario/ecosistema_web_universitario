import { Test, TestingModule } from '@nestjs/testing';
import { PrelocalizationController } from './prelocalization.controller';

describe('PrelocalizationController', () => {
  let controller: PrelocalizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrelocalizationController],
    }).compile();

    controller = module.get<PrelocalizationController>(PrelocalizationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
