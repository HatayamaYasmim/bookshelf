import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';
import { MediaModule } from 'src/media/media.module';

describe('AiService', () => {
  let service: AiService;

  beforeEach(async () => {
    process.env.GEMINI_API_KEY = 'test-api-key';

    const module: TestingModule = await Test.createTestingModule({
      imports: [MediaModule],
      providers: [AiService],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
