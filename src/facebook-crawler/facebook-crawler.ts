import { Browser, Page } from "puppeteer";
import { launchBrowser } from "./functions/browser";
import { CrawlDto } from "./dto/crawl.dto";
import { StartDto } from "./dto/start.dto";
import { FacebookGroupCrawlRes } from "./res/facebook-group-crawl.res";
import { parseHumanReadableNumber } from "src/utils/parse-human-readable-number";

type Status = {
	pendingAbort: boolean;
	browserRunning: boolean;
	taskId: number | null;
	crawledDatum?: FacebookGroupCrawlRes;
};

export class FacebookCrawler {
	public pendingAbort: boolean = false;
	public browserRunning: boolean = false;
	public taskId: number | null;

	private browser: Browser | null;
	private page: Page | null;

	constructor() {}

	async launch(startDto: StartDto): Promise<Status> {
		this.browser = await launchBrowser();
		this.page = await this.browser.newPage();
		await this.page.setViewport({ width: 1920, height: 1080 });
		this.taskId = startDto.taskId;
		this.browserRunning = true;
		this.loop();
		return {
			pendingAbort: this.pendingAbort,
			browserRunning: this.browserRunning,
			taskId: this.taskId,
		};
	}

	async loop() {
		if (this.pendingAbort) {
			if (this.browser) {
				try {
					await this.page.close();
					await this.browser.close();
					this.page = null;
					this.browser = null;
					this.browserRunning = false;
					this.taskId = null;
					this.pendingAbort = false;
					console.log("Browser closed gracefully.");
				} catch (error) {
					console.error("Error closing browser:", error);
				}
			}
		}
		setTimeout(() => {
			this.loop();
		}, 1500);
	}

	async crawl(crawlDto: CrawlDto): Promise<Status> {
		if (this.pendingAbort) {
			try {
				await this.page.close();
				await this.browser.close();
				this.page = null;
				this.browser = null;
				this.browserRunning = false;
				this.taskId = null;
				this.pendingAbort = false;
				console.log("Browser closed gracefully.");
			} catch (error) {
				console.error("Error closing browser:", error);
			}
			return {
				pendingAbort: this.pendingAbort,
				browserRunning: this.browserRunning,
				taskId: this.taskId,
			};
		}

		if (!this.browser) {
			return {
				pendingAbort: this.pendingAbort,
				browserRunning: this.browserRunning,
				taskId: this.taskId,
			};
		}

		const groupAddress = crawlDto.sourceData.groupAddress;
		const groupName = crawlDto.sourceData.groupName;
		try {
			await this.page.goto(`${groupAddress}/about`, { timeout: 15000 });
			await this.page.waitForSelector("h1 span > a"); /* Group Name */
			await this.page.waitForSelector(
				".x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.x1gslohp.x12nagc.xzboxd6.x14l7nz5"
			); /* Members & new posts last month */
			const groupName: string = await this.page.evaluate(() => {
				return document.querySelector("h1 span > a")
					?.innerHTML as string;
			});
			/* Member count */
			const memberCount: string = await this.page.evaluate(() => {
				if (
					document.querySelector(
						".x6s0dn4.x78zum5.x1a02dak.xwya9rg.xx6bls6.x1pi30zi.x1swvt13.x1xy6bms"
					)
				) {
					return "This Group is Paused.";
				} else {
					if (
						document.querySelectorAll(
							".x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.x1gslohp.x12nagc.xzboxd6.x14l7nz5"
						)
					) {
						/* tabs found */
						if (
							/* 'Activity' tabs found */
							document
								.querySelectorAll(
									".x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.x1gslohp.x12nagc.xzboxd6.x14l7nz5"
								)[5]
								.querySelectorAll(
									".x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x3x7a5m.x6prxxf.xvq8zen.xo1l8bm.xzsf02u.x1yc453h"
								)[1]
						) {
							return document
								.querySelectorAll(
									".x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.x1gslohp.x12nagc.xzboxd6.x14l7nz5"
								)[5]
								.querySelectorAll(
									".x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x3x7a5m.x6prxxf.xvq8zen.xo1l8bm.xzsf02u.x1yc453h"
								)[1]
								.innerHTML.split(" total members")[0];
						} else {
							return document
								.querySelectorAll(
									".x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.x1gslohp.x12nagc.xzboxd6.x14l7nz5"
								)[6]
								.querySelectorAll(
									".x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x3x7a5m.x6prxxf.xvq8zen.xo1l8bm.xzsf02u.x1yc453h"
								)[1]
								.innerHTML.split(" total members")[0];
						}
					} else {
						/* no tabs found */
						return "0";
					}
				}
			});
			/* New post last month */
			const monthlyPostCount: string = await this.page.evaluate(() => {
				if (
					document.querySelectorAll(
						".x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.x1gslohp.x12nagc.xzboxd6.x14l7nz5"
					)
				) {
					if (
						document
							.querySelectorAll(
								".x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.x1gslohp.x12nagc.xzboxd6.x14l7nz5"
							)[5]
							.querySelectorAll(
								".x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x4zkp8e.x676frb.x1nxh6w3.x1sibtaa.xo1l8bm.xi81zsa.x1yc453h"
							)[0]
					) {
						if (
							document
								.querySelectorAll(
									".x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.x1gslohp.x12nagc.xzboxd6.x14l7nz5"
								)[5]
								.querySelectorAll(
									".x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x4zkp8e.x676frb.x1nxh6w3.x1sibtaa.xo1l8bm.xi81zsa.x1yc453h"
								)[0]
								.innerHTML.split("\x3C!-- -->")[0] ===
							"No posts in the last month"
						) {
							return "0";
						} else {
							return document
								.querySelectorAll(
									".x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.x1gslohp.x12nagc.xzboxd6.x14l7nz5"
								)[5]
								.querySelectorAll(
									".x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x4zkp8e.x676frb.x1nxh6w3.x1sibtaa.xo1l8bm.xi81zsa.x1yc453h"
								)[0]
								.innerHTML.split("\x3C!-- -->")[0]
								.replace(" in the last month", "") as string;
						}
					} else {
						if (
							document
								.querySelectorAll(
									".x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.x1gslohp.x12nagc.xzboxd6.x14l7nz5"
								)[6]
								.querySelectorAll(
									".x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x4zkp8e.x676frb.x1nxh6w3.x1sibtaa.xo1l8bm.xi81zsa.x1yc453h"
								)[0]
								.innerHTML.split("\x3C!-- -->")[0] ===
							"No posts in the last month"
						) {
							return "0";
						} else {
							return document
								.querySelectorAll(
									".x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.x1gslohp.x12nagc.xzboxd6.x14l7nz5"
								)[6]
								.querySelectorAll(
									".x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x4zkp8e.x676frb.x1nxh6w3.x1sibtaa.xo1l8bm.xi81zsa.x1yc453h"
								)[0]
								.innerHTML.split("\x3C!-- -->")[0]
								.replace(" in the last month", "") as string;
						}
					}
				} else {
					return "0";
				}
			});
			const parsedMemberCount = parseHumanReadableNumber(memberCount);
			const parsedMonthlyPostCount =
				parseHumanReadableNumber(monthlyPostCount);
			const crawledDatum: FacebookGroupCrawlRes = {
				taskId: this.taskId,
				groupAddress: groupAddress,
				groupName: groupName,
				failed:
					parsedMemberCount === null ||
					parsedMonthlyPostCount === null
						? true
						: false,
				memberCount: parsedMemberCount === null ? 0 : parsedMemberCount,
				monthlyPostCount:
					parsedMonthlyPostCount === null
						? 0
						: parsedMonthlyPostCount,
			};
			return {
				pendingAbort: this.pendingAbort,
				browserRunning: this.browserRunning,
				taskId: this.taskId,
				crawledDatum: crawledDatum,
			};
		} catch (error) {
			if (error.name === "TimeoutError") {
				console.error(error);
				console.error(
					`Timeout Error: timeout error when crawling ${groupAddress}`
				);
				/* handle timeout specifically (e.g., retry, log, take screenshot) */
			} else {
				console.error("An unexpected error occurred: ", error);
			}
			const crawledDatum: FacebookGroupCrawlRes = {
				taskId: this.taskId,
				groupAddress: groupAddress,
				groupName: groupName,
				failed: true,
				memberCount: 0,
				monthlyPostCount: 0,
			};
			return {
				pendingAbort: this.pendingAbort,
				browserRunning: this.browserRunning,
				taskId: this.taskId,
				crawledDatum: crawledDatum,
			};
		}
	}

	abort(): Status {
		this.pendingAbort = true;
		return {
			pendingAbort: this.pendingAbort,
			browserRunning: this.browserRunning,
			taskId: this.taskId,
		};
	}

	getStatus(): Status {
		return {
			pendingAbort: this.pendingAbort,
			browserRunning: this.browserRunning,
			taskId: this.taskId,
		};
	}
}
