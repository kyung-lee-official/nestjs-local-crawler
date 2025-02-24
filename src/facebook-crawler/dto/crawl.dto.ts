import { z } from "zod";

export const crawlSchema = z.object({
	taskId: z.number(),
	sourceData: z.object({
		groupAddress: z
			.string()
			.url()
			.regex(/facebook.com\/groups\/[a-zA-Z0-9\.]+$/g),
		groupName: z.string(),
	}),
});

export type CrawlDto = z.infer<typeof crawlSchema>;
