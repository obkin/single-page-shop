import { HTTPError } from '../exceptions/http-error.class';
import { IMiddleware } from './middleware.interface';
import { Request, Response, NextFunction } from 'express';

class AuthGuardMiddleware implements IMiddleware {
	exec(req: Request, res: Response, next: NextFunction): void {
		if (req.userId && req.userEmail) {
			next();
		} else {
			next(new HTTPError(401, 'user is not authorized', 'login'));
		}
	}
}

export { AuthGuardMiddleware };
