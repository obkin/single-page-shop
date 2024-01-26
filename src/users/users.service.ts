import { inject, injectable } from 'inversify';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUsersService } from './users.service.interface';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { IUsersRepository } from './users.repository.interface';
import { UserModel } from '@prisma/client';
import { UserLoginDto } from './dto/user-login.dto';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class UsersService implements IUsersService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
		@inject(TYPES.ILogger) private loggerService: ILogger,
	) {}
	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null | void> {
		try {
			const newUser = new User(email, name);
			const salt = this.configService.get('SALT');
			await newUser.setPassword(password, Number(salt));
			const existUser = await this.usersRepository.find(email);
			if (existUser) {
				return null;
			} else {
				return this.usersRepository.create(newUser);
			}
		} catch (e) {
			if (e instanceof Error) {
				this.loggerService.error(`[PostsService]: ${e.message}`);
			}
		}
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		try {
			const existUser = await this.usersRepository.find(email);
			if (existUser) {
				const newUser = new User(existUser.email, existUser.userName, existUser.password);
				return newUser.comparePassword(password);
			} else {
				return false;
			}
		} catch (e) {
			if (e instanceof Error) {
				this.loggerService.error(`[PostsService]: ${e.message}`);
			}
			return false; // need to fix
		}
	}

	async findUser(email: string): Promise<UserModel | null | void> {
		try {
			return await this.usersRepository.find(email);
		} catch (e) {
			if (e instanceof Error) {
				this.loggerService.error(`[PostsService]: ${e.message}`);
			}
		}
	}
}
