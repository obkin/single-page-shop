import { Logger, ISettingsParam, ILogObj } from 'tslog';
import { ILogger } from './logger.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';

const loggerSettings = {
	displayInstanceName: false,
	displayLoggerName: false,
	displayFilePath: 'hidden',
	displayFunctionName: false,
};

@injectable()
class LoggerService implements ILogger {
	public logger: Logger<ILogObj>;

	constructor() {
		this.logger = new Logger<ILogObj>(loggerSettings as ISettingsParam<ILogObj>);
	}

	log(...args: unknown[]): void {
		this.logger.info(...args);
	}

	error(...args: unknown[]): void {
		// send error to sentry / rollbar
		this.logger.error(...args);
	}

	warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}
}

export { LoggerService };
