import { ApiBodyOptions } from "@nestjs/swagger";

export class CreateDto {
	taskId: number;
	constructor(dto: CreateDto) {
		this.taskId = dto.taskId;
	}
}

export const createCrawlerTaskBodyOptions: ApiBodyOptions = {
	type: CreateDto,
	description: "create the crawler task",
	examples: {
		"Seed server": {
			value: {
				taskId: 1,
			},
		},
	},
};
