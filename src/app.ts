import express, { Express } from 'express';
import { Server } from 'http';
import { injectable, inject } from 'inversify';
import { TYPES } from './types';
import { ILogger } from './logger/logger.interface';
import { PrismaService } from './database/prisma.service';
import { IConfigService } from './config/config.service.interface';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		// @inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = 8000;
	}

	public async init(): Promise<void> {
		try {
			this.app.listen(this.port);
			await this.prismaService.connect();
			this.logger.log(`[App]: The server started at: http://localhost:${this.port}`);
		} catch (e) {
			if (e instanceof Error) {
				this.logger.error(e.message);
			}
		}
	}
}
