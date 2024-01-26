import { UserModel } from '@prisma/client';
import { IUsersRepository } from './users.repository.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { PrismaService } from '../database/prisma.service';
import { User } from './user.entity';

@injectable()
class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create({ email, password, name }: User): Promise<UserModel | void> {
		try {
			return await this.prismaService.client.userModel.create({
				data: {
					email,
					password,
					userName: name,
				},
			});
		} catch (e) {
			if (e instanceof Error) {
				throw new Error(e.message);
			}
		}
	}

	async find(email: string): Promise<UserModel | null | void> {
		try {
			return this.prismaService.client.userModel.findFirst({
				where: {
					email,
				},
			});
		} catch (e) {
			if (e instanceof Error) {
				throw new Error(e.message);
			}
		}
	}
}

export { UsersRepository };
