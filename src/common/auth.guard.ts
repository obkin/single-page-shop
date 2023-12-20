import { HTTPError } from '../errors/http-error.class';
import { IMiddleware } from './middleware.interface';
import { Request, Response, NextFunction } from 'express';

class AuthGuardMiddleware implements IMiddleware {
	exec({ user }: Request, res: Response, next: NextFunction): void {
		if (user) {
			next();
		} else {
			next(new HTTPError(401, 'user is not authorized', 'login'));
		}
	}
}

export { AuthGuardMiddleware };
