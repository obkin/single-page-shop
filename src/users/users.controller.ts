import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../exceptions/http-error.class';
import { ILogger } from '../logger/logger.interface';
import { inject, injectable } from 'inversify';
import { IUsersController } from './users.controller.interface';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { ValidateMiddleware } from '../common/validate.middleware';
import { sign } from 'jsonwebtoken';
import { IUsersService } from './users.service.interface';
import { IConfigService } from '../config/config.service.interface';
import { AuthGuardMiddleware } from '../common/auth.guard';
import 'reflect-metadata';

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UsersService) private userService: IUsersService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);

		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthGuardMiddleware()],
			},
		]);
	}

	async register(
		req: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(req.body);
		if (!result) {
			return next(new HTTPError(422, 'such user already exists', 'register'));
		} else {
			this.ok(res, { email: result.email, id: result.id });
		}
	}

	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.validateUser(req.body);
		if (!result) {
			return next(new HTTPError(401, 'authorize error', 'login'));
		} else {
			const jwt = await this.signJWT(req.body.email, this.configService.get('SECRET'));
			this.ok(res, { jwt });
		}
	}

	async info(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (req.body.email) {
			const userInfo = await this.userService.findUser(req.body.email);
			this.ok(res, { email: userInfo?.email, id: userInfo?.id });
		} else {
			return next(new HTTPError(401, 'such user is not exists', 'info'));
		}
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise((resolve, reject) => {
			sign(
				{
					userEmail: email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					} else {
						resolve(token as string);
					}
				},
			);
		});
	}
}
