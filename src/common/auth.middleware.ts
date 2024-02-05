import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './middleware.interface';
import { verify } from 'jsonwebtoken';

class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}

	exec(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			verify(req.headers.authorization.split(' ')[1], this.secret, (err, payload) => {
				if (err) {
					next();
				} else if (payload) {
					if (typeof payload == 'object') {
						req.user = payload.userEmail;
						next();
					}
				}
			});
		} else {
			next();
		}
	}
}

export { AuthMiddleware };
