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
				main: '/users',
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				main: '/users',
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				main: '/users',
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
			return next(new HTTPError(422, 'such user already exists', 'UsersController -> register'));
		} else {
			this.created(res, { status: 'registered', email: result.email, id: result.id });
			this.loggerService.log(`[UsersController]: new user ( ${result.email} ) registered`);
		}
	}

	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.validateUser(req.body);

		if (!result) {
			return next(
				new HTTPError(401, `( ${req.body.email} ) wrong credentials`, 'UsersController -> login'),
			);
		} else {
			const userData = await this.userService.findUser(req.body.email);

			if (userData) {
				const jwt = await this.signJWT(
					userData.id,
					userData.email,
					this.configService.get('SECRET'),
				);
				this.ok(res, { userId: userData.id, jwt });
				this.loggerService.log(`[UsersController]: user ( ${req.body.email} ) signed in`);
			} else {
				next(new HTTPError(404, `user ${req.body.email} not found`, 'UsersController -> login'));
			}
		}
	}

	async info({ userId, userEmail }: Request, res: Response, next: NextFunction): Promise<void> {
		const userInfo = await this.userService.findUser(userEmail);
		console.log(userId);

		if (!userInfo) {
			return next(new HTTPError(401, 'user is not authorized', 'UsersController -> info'));
		} else {
			const userData = {
				id: userInfo.id,
				name: userInfo.userName,
				email: userInfo.email,
				iat: userInfo.createdAt,
			};
			this.ok(res, userData);
			this.loggerService.log(`[UsersController]: info about user ( ${userInfo.email} ) sent`);
		}
	}

	private signJWT(id: number, email: string, secret: string): Promise<string> {
		return new Promise((resolve, reject) => {
			sign(
				{
					userId: id,
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
