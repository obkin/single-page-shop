import express, { Express } from 'express';
import { Server } from 'http';
import { injectable, inject } from 'inversify';
import { TYPES } from './types';
import { ILogger } from './logger/logger.interface';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		this.app = express();
		this.port = 8000;
	}

	public async init(): Promise<void> {
		try {
			this.app.listen(this.port);
			this.logger.log(`[App]: The server started at: http://localhost:${this.port}`);
		} catch (e) {
			if (e instanceof Error) {
				this.logger.error(e.message);
			}
		}
	}
}
