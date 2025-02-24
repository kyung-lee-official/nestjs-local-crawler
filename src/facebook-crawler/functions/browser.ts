import puppeteer, { Browser } from "puppeteer";

export const launchBrowser = async (): Promise<Browser> => {
	const enableProxy = !!(
		process.env.PROXY_PROTOCOL &&
		process.env.PROXY_HOST &&
		process.env.PROXY_PORT
	);

	try {
		const browser: Browser = await puppeteer.launch({
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
		return browser;
	} catch (error) {
		console.error(
			"Error launching browser, make sure your Chrome is not running:"
		);
		throw error;
	}
};
