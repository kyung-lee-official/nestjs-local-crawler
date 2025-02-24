import { BadRequestException, Injectable } from "@nestjs/common";
import { FacebookCrawler } from "./facebook-crawler";
import { CrawlDto } from "./dto/crawl.dto";
import { StartDto } from "./dto/start.dto";

@Injectable()
export class FacebookCrawlerService {
	/* store your program instance */
	private programInstance: FacebookCrawler | null = null;

	constructor() {}

	async start(crawlDto: StartDto) {
		/* only one instance allowed */
		if (this.programInstance) {
			throw new BadRequestException("Program already running.");
		}

		/* initialize your time-consuming program instance here */
		this.programInstance = new FacebookCrawler();
		return await this.programInstance.start(crawlDto);
	}

	async crawl(crawlDto: CrawlDto) {
		/* ensure there is an instance */
		if (!this.programInstance) {
			throw new BadRequestException("Program not running.");
		}
		const crawlRes = await this.programInstance.crawl(crawlDto);
		return crawlRes;
	}

	async abort() {
		/* ensure there is an instance */
		if (!this.programInstance) {
			throw new BadRequestException("Program not running.");
		}
		await this.programInstance.abort();
		this.programInstance = null;
		return { status: "aborted" };
	}

	async getStatus() {
		if (this.programInstance) {
			return { running: true, taskId: this.programInstance.taskId };
		} else {
			return { running: false };
		}
	}
}
