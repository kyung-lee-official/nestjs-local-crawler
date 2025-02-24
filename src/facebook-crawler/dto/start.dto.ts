import { z } from "zod";

export const startSchema = z.object({
	taskId: z.number(),
});

export type StartDto = z.infer<typeof startSchema>;
