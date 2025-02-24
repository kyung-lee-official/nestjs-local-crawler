import { Test, TestingModule } from '@nestjs/testing';
import { FacebookCrawlerController } from './facebook-crawler.controller';
import { FacebookCrawlerService } from './facebook-crawler.service';

describe('FacebookCrawlerController', () => {
  let controller: FacebookCrawlerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacebookCrawlerController],
      providers: [FacebookCrawlerService],
    }).compile();

    controller = module.get<FacebookCrawlerController>(FacebookCrawlerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
