import { inject, injectable } from 'inversify';
import { IConfigService } from './config.service.interface';
import { TYPES } from '../types';
import { DotenvConfigOutput, DotenvParseOutput, config } from 'dotenv';
import { ILogger } from '../logger/logger.interface';

@injectable()
class ConfigService implements IConfigService {
	private envConfig: DotenvParseOutput;
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.logger.error('[ConfigService]: configuration file (.env) not loaded or not found');
		} else {
			this.logger.log('[ConfigService]: configuration file (.env) loaded');
			this.envConfig = result.parsed as DotenvParseOutput;
		}
	}

	get(key: string): string {
		return this.envConfig[key];
	}
}

export { ConfigService };
