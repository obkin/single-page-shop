import express, { Express, json } from 'express';
import { Server } from 'http';
import { injectable, inject } from 'inversify';
import { TYPES } from './types';
import { ILogger } from './logger/logger.interface';
import { PrismaService } from './database/prisma.service';
import { PostsController } from './posts/posts.controller';
import cors from 'cors';
import { IExceptionFilter } from './exceptions/exception.filter.interface';
import { UsersController } from './users/users.controller';
import { AuthMiddleware } from './common/auth.middleware';
import { IConfigService } from './config/config.service.interface';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
		@inject(TYPES.UsersController) private usersController: UsersController,
		@inject(TYPES.PostsController) private postsController: PostsController,
	) {
		this.app = express();
		this.port = 8870;
	}

	useMiddlewares(): void {
		this.app.use(json());
		this.app.use(cors());
		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
		this.app.use(authMiddleware.exec.bind(authMiddleware));
	}

	useRoutes(): void {
		this.app.use('/users', this.usersController.router);
		this.app.use('/posts', this.postsController.router);
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
		this.loggerService.log(`[App]: ExceptionFilter launched`);
	}

	public async init(): Promise<void> {
		try {
			this.useMiddlewares();
			this.useRoutes();
			this.useExceptionFilters();
			await this.prismaService.connect();
			this.app.listen(this.port);
			this.loggerService.log(`[App]: The server started at: http://localhost:${this.port}`);
		} catch (e) {
			if (e instanceof Error) {
				this.loggerService.error(e.message);
			}
		}
	}
}
