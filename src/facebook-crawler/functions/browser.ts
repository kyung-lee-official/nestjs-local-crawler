import { InternalServerErrorException } from "@nestjs/common";
import puppeteer, { Browser } from "puppeteer";

export const launchBrowser = async (): Promise<Browser> => {
	let browser: Browser;
	const enableProxy = !!(
		process.env.PROXY_PROTOCOL &&
		process.env.PROXY_HOST &&
		process.env.PROXY_PORT
	);

	try {
		browser = await puppeteer.launch({
			headless: false,
			executablePath: process.env.CHROME_EXECUTABLE_PATH,
			userDataDir: process.env.CHROME_USER_DATA_DIR,
			args: enableProxy
				? [
						`--profile-directory=${process.env.CHROME_PROFILE_NAME}`,
						`--proxy-server=${process.env.PROXY_PROTOCOL}://${process.env.PROXY_HOST}:${process.env.PROXY_PORT}`,
					]
				: [`--profile-directory=${process.env.CHROME_PROFILE_NAME}`],
			devtools: true,
		});
	} catch (error) {
		throw new InternalServerErrorException(error);
	}
	return browser;
};
