import express, { Express, json } from 'express';
import { Server } from 'http';
import { injectable, inject } from 'inversify';
import { TYPES } from './types';
import { ILogger } from './logger/logger.interface';
import { PrismaService } from './database/prisma.service';
import { PostsController } from './posts/posts.controller';
import cors from 'cors';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
		@inject(TYPES.PostsController) private postsController: PostsController,
	) {
		this.app = express();
		this.port = 8870;
	}

	useMiddlewares(): void {
		this.app.use(json());
		this.app.use(cors());
	}

	useRoutes(): void {
		this.app.use('/posts', this.postsController.router);
	}

	public async init(): Promise<void> {
		try {
			this.useMiddlewares();
			this.useRoutes();
			this.app.listen(this.port);
			await this.prismaService.connect();
			this.loggerService.log(`[App]: The server started at: http://localhost:${this.port}`);
		} catch (e) {
			if (e instanceof Error) {
				this.loggerService.error(e.message);
			}
		}
	}
}
