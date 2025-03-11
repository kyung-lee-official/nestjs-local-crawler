import { z } from "zod";

export const facebookgroupcrawlSchema = z.object({
	taskId: z.number().int(),
	groupAddress: z
		.string()
		.url()
		.regex(/facebook.com\/groups\/[a-zA-Z0-9\.]+$/g),
	groupName: z.string(),
	status: z.union([
		z.literal("PENDING"),
		z.literal("SUCCESS"),
		z.literal("FAILED"),
	]),
	memberCount: z.number().int(),
	monthlyPostCount: z.number().int(),
});

export type FacebookGroupCrawlRes = z.infer<typeof facebookgroupcrawlSchema>;
