import { Test, TestingModule } from '@nestjs/testing';
import { FacebookCrawlerService } from './facebook-crawler.service';

describe('FacebookCrawlerService', () => {
  let service: FacebookCrawlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FacebookCrawlerService],
    }).compile();

    service = module.get<FacebookCrawlerService>(FacebookCrawlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
