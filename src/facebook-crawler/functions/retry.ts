/**
 * Retry a function.
 * @param fn Function to retry.
 * @param maxRetries Maximum times to retry.
 * */
async function retry<T>(
	fn: () => Promise<T>,
	maxRetries?: number
): Promise<T | undefined> {
	try {
		const success = await fn();
		return success;
	} catch (error: any) {
		console.log(`Error caught, retrying...`);
		if (maxRetries == null) {
			return await retry(fn);
		} else {
			if (maxRetries <= 0) {
				console.log(`Maximum try times reached.`);
				console.error(error);
				throw error;
			} else {
				return await retry(fn, maxRetries - 1);
			}
		}
	}
}
export default retry;
