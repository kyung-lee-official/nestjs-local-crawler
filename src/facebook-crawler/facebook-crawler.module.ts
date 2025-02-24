import { Module } from "@nestjs/common";
import { FacebookCrawlerService } from "./facebook-crawler.service";
import { FacebookCrawlerController } from "./facebook-crawler.controller";

@Module({
	controllers: [FacebookCrawlerController],
	providers: [FacebookCrawlerService],
})
export class FacebookCrawlerModule {}
