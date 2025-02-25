import { Body, Controller, Get, Post } from "@nestjs/common";
import { FacebookCrawlerService } from "./facebook-crawler.service";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { StartDto, startSchema } from "./dto/start.dto";
import { CrawlDto, crawlSchema } from "./dto/crawl.dto";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import { createCrawlerTaskBodyOptions } from "./swagger/start-crawler-task.swagger";

@ApiTags("Facebook Crawler")
@Controller("facebook-crawler")
export class FacebookCrawlerController {
	constructor(
		private readonly facebookCrawlerService: FacebookCrawlerService
	) {}

	@ApiOperation({ summary: "Start the crawler program" })
	@ApiBody(createCrawlerTaskBodyOptions)
	@Post("launch")
	async launch(
		@Body(new ZodValidationPipe(startSchema))
		crawlDto: StartDto
	) {
		return await this.facebookCrawlerService.launch(crawlDto);
	}

	@ApiOperation({ summary: "Crawl the data, one datum per request" })
	@Post("crawl")
	async crawl(
		@Body(new ZodValidationPipe(crawlSchema))
		crawlDto: CrawlDto
	) {
		return await this.facebookCrawlerService.crawl(crawlDto);
	}

	@ApiOperation({ summary: "Abort the program" })
	@Post("abort")
	abort() {
		return this.facebookCrawlerService.abort();
	}

	@ApiOperation({ summary: "Get the status of the program" })
	@Get("get-status")
	getStatus() {
		return this.facebookCrawlerService.getStatus();
	}
}
