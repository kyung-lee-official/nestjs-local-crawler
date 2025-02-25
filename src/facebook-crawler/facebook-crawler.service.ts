import { BadRequestException, Injectable } from "@nestjs/common";
import { FacebookCrawler } from "./facebook-crawler";
import { CrawlDto } from "./dto/crawl.dto";
import { StartDto } from "./dto/start.dto";

@Injectable()
export class FacebookCrawlerService {
	/* store your program instance */
	private programInstance: FacebookCrawler | null = null;

	constructor() {}

	async launch(crawlDto: StartDto) {
		/* only one instance allowed */
		if (!this.programInstance) {
			/* no instance yet, create one */
			this.programInstance = new FacebookCrawler();
			return await this.programInstance.launch(crawlDto);
		} else {
			/* instance already exists, check browser status */
			if (this.programInstance.browserRunning) {
				throw new BadRequestException("Browser already running.");
			} else {
				/* instance exists, but browser is not running, start it */
				return await this.programInstance.launch(crawlDto);
			}
		}
	}

	async crawl(crawlDto: CrawlDto) {
		/* ensure there is an instance */
		if (!this.programInstance) {
			throw new BadRequestException("Crawler not running.");
		}
		const crawlRes = await this.programInstance.crawl(crawlDto);
		return crawlRes;
	}

	abort() {
		/* ensure there is an instance */
		if (!this.programInstance) {
			throw new BadRequestException("Crawler not running.");
		}
		return this.programInstance.abort();
	}

	getStatus() {
		/* ensure there is an instance */
		if (!this.programInstance) {
			return {
				pendingAbort: false,
				browserRunning: false,
				taskId: null,
			};
		}
		return this.programInstance.getStatus();
	}
}
