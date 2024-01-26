import { Router, Response } from 'express';
import { ExpressReturnType, IControllerRoute } from './route.interface';
import { ILogger } from '../logger/logger.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, code: number, message: T, totalCount?: string): ExpressReturnType {
		res.type('application/json');
		res.set('Access-Control-Expose-Headers', 'X-Total-Count');
		res.header('X-Total-Count', totalCount);
		return res.status(code).json(message);
	}

	public ok<T>(res: Response, message: T, totalCount?: string): ExpressReturnType {
		return this.send<T>(res, 200, message, totalCount);
	}

	public created<T>(res: Response, message: T): ExpressReturnType {
		return this.send<T>(res, 201, message);
	}

	public deleted<T>(res: Response, message: T): ExpressReturnType {
		return this.send<T>(res, 204, message);
	}

	public badRequest<T>(res: Response, message: T): ExpressReturnType {
		return this.send<T>(res, 400, message);
	}

	public notFound<T>(res: Response, message: T): ExpressReturnType {
		return this.send<T>(res, 404, message);
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		for (const route of routes) {
			this.logger.log(`[BaseController]: created route: ${route.main}${route.path}`);
			const middlewares = route.middlewares?.map((m) => m.exec.bind(m));
			const handler = route.func.bind(this);
			const pipeline = middlewares ? [...middlewares, handler] : handler;
			this.router[route.method](route.path, pipeline);
		}
	}
}

export { BaseController };
