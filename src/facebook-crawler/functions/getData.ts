import { Browser } from "puppeteer-core";
import * as fs from "fs";
import { CrawledDataStruct, TrackedObjectStruct } from "../types/types";

/* Config */
let rawConfig: string = fs.readFileSync("config.json", "utf8");
let config = JSON.parse(rawConfig);
let enableProxy: boolean = config.enableProxy;
let proxyPort: number = config.proxyPort;
let delayPerPage: number = config.delayPerPage;

/**
 * Read web data according to the given TrackedObjectStruct array.
 * */
async function getData(
	browser: Browser,
	trackedObjects: Array<TrackedObjectStruct>
): Promise<Array<CrawledDataStruct>> {
	let data: Array<CrawledDataStruct> = [];
	let href: string;
	// const browser = await puppeteer.launch({
	// 	headless: false,
	// 	/** Launch chromium using a proxy server on a designated port.
	// 	 * More on proxying:
	// 	 * https://www.chromium.org/developers/design-documents/network-settings */
	// 	args: enableProxy ? [`--proxy-server=socks5://127.0.0.1:${proxyPort}`] : [],
	// 	executablePath: "./node_modules/puppeteer/.local-chromium/win64-1022525/chrome-win/chrome.exe",
	// 	// userDataDir: "./userData"
	// }).catch((error) => {
	// 	console.error(error);
	// });
	if (browser) {
		const page = await browser.newPage();
		await page.setViewport({ width: 1920, height: 1080 });
		// await page.goto("https://www.facebook.com");
		// /* Sign in */
		// await page.waitForSelector("input#email");
		// await page.click("input#email");
		// await page.keyboard.type(FB_ACCOUNT as string);
		// await page.waitForSelector("input#pass");
		// await page.click("input#pass");
		// await page.keyboard.type(FB_PASSWORD as string);
		// await page.waitForSelector('button[name="login"]');
		// await page.click('button[name="login"]');
		// /* Wait for next page */
		// await new Promise((resolve) => {
		// 	return setTimeout(resolve, 6000);
		// });
		// href = await page.evaluate(() => {
		// 	return location.href;
		// });
		// if (href === "https://www.facebook.com/checkpoint/?next") {
		// 	pass2FA(page);
		// }
		// await waitForUserInput(page);
		for (const trackedObject of trackedObjects) {
			const link = trackedObject.link.endsWith("/")
				? trackedObject.link.slice(0, -1)
				: trackedObject.link;
			console.log(
				`Fetching data of row ${trackedObject.row}, link: ${link}`
			);
			try {
				await page.goto(`${link}/about`);
				await page.waitForSelector("h1 span > a"); /* Group Name */
				await page.waitForSelector(
					".x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.x1gslohp.x12nagc.xzboxd6.x14l7nz5"
				); /* Members & new posts last month */
				const groupName: string = await page.evaluate(() => {
					return document.querySelector("h1 span > a")
						?.innerHTML as string;
				});
				/* Member count */
				const memberCount: string = await page.evaluate(() => {
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
							if (
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
							return "0";
						}
					}
				});
				/* New post last month */
				const newPostLastMonth: string = await page.evaluate(() => {
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
									.replace(
										" in the last month",
										""
									) as string;
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
									.replace(
										" in the last month",
										""
									) as string;
							}
						}
					} else {
						return "0";
					}
				});
				const crawledDatum = {
					row: trackedObject.row,
					link: link,
					groupName: groupName,
					memberCount: memberCount,
					newPostLastMonth: newPostLastMonth,
				};
				console.log(crawledDatum);
				data.push(crawledDatum);
			} catch (error) {
				console.error(`Failed to fetch data from ${link}`);
			}
			await new Promise((resolve) => {
				return setTimeout(resolve, delayPerPage);
			});
		}
		await browser.close();
	}
	return data;
}

export default getData;
