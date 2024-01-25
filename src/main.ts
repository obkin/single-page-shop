import 'reflect-metadata';
import { App } from './app';
import { Container, ContainerModule, interfaces } from 'inversify';
import { LoggerService } from './logger/logger.service';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { PrismaService } from './database/prisma.service';
import { IPostsRepository } from './posts/posts.repository.interface';
import { PostsRepository } from './posts/posts.repository';
import { IPostsService } from './posts/posts.service.interface';
import { PostsService } from './posts/posts.service';
import { IPostsController } from './posts/posts.controller.interface';
import { PostsController } from './posts/posts.controller';
import { IExceptionFilter } from './exceptions/exception.filter.interface';
import { ExceptionFilter } from './exceptions/exception.filter';
import { IUsersController } from './users/users.controller.interface';
import { UsersController } from './users/users.controller';
import { IUsersService } from './users/users.service.interface';
import { UsersService } from './users/users.service';
import { IUsersRepository } from './users/users.repository.interface';
import { UsersRepository } from './users/users.repository';

interface IBootstrapReturnType {
	app: App;
	appContainer: Container;
}

// Dependency Injection Tree (creating Inversify container and container module):
const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();

	bind<IPostsRepository>(TYPES.PostsRepoitory).to(PostsRepository).inSingletonScope();
	bind<IPostsService>(TYPES.PostsService).to(PostsService).inSingletonScope();
	bind<IPostsController>(TYPES.PostsController).to(PostsController).inSingletonScope();

	bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
	bind<IUsersService>(TYPES.UsersService).to(UsersService).inSingletonScope();
	bind<IUsersController>(TYPES.UsersController).to(UsersController).inSingletonScope();

	bind<App>(TYPES.Application).to(App).inSingletonScope();
});

async function bootstrap(): Promise<IBootstrapReturnType> {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	await app.init();
	return { appContainer, app };
}

export const bootstrapReturn = bootstrap();
