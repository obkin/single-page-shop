import 'reflect-metadata';
import { App } from './app';
import { Container, ContainerModule, interfaces } from 'inversify';
import { LoggerService } from './logger/logger.service';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';

interface IBootstrapReturnType {
	app: App;
	appContainer: Container;
}

// Dependency Injection Tree (creating Inversify container and container module):
const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
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
