import { Request, Response, NextFunction, Router } from 'express';
import { IMiddleware } from './middleware.interface';

class IControllerRoute {
	main: string;
	path: string;
	func: (req: Request, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
	middlewares?: IMiddleware[];
}

type ExpressReturnType = Response<any, Record<string, any>>;

export { IControllerRoute, ExpressReturnType };
