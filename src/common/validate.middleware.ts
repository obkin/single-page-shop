import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './middleware.interface';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

class ValidateMiddleware implements IMiddleware {
	constructor(private classToValidade: ClassConstructor<object>) {}

	exec(req: Request, res: Response, next: NextFunction): void {
		const instance = plainToClass(this.classToValidade, req.body);
		validate(instance).then((errors) => {
			if (errors.length > 0) {
				res.status(422).send(errors);
			} else {
				next();
			}
		});
	}
}

export { ValidateMiddleware };
