import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {QueryFailedExceptionFilter} from "./exceptions/handler/query-failed-error.filter";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            whitelist: true,
        }),
    )
    app.useGlobalFilters(new QueryFailedExceptionFilter());
    await app.listen(process.env.PORT ?? 3001);
}

bootstrap();