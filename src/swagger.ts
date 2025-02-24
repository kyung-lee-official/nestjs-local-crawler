import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { FacebookCrawlerModule } from "./facebook-crawler/facebook-crawler.module";

export function setupSwagger(app: INestApplication) {
	const applicationOption = new DocumentBuilder()
		.setTitle("Facebook Crawler")
		.setDescription("# Facebook Crawler")
		.setVersion("1.0.0")
		.addBearerAuth()
		.build();
	const applicationDocument = SwaggerModule.createDocument(
		app,
		applicationOption,
		{
			include: [FacebookCrawlerModule],
		}
	);
	SwaggerModule.setup("api/applications", app, applicationDocument);
}
