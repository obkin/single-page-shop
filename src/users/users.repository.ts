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

	async findByEmail(email: string): Promise<UserModel | null | void> {
		try {
			return await this.prismaService.client.userModel.findFirst({
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

	async findById(userId: number): Promise<UserModel | null | void> {
		try {
			return await this.prismaService.client.userModel.findFirst({
				where: {
					id: userId,
				},
			});
		} catch (e) {
			if (e instanceof Error) {
				throw new Error(e.message);
			}
			return null;
		}
	}

	async changeName(userId: number, newName: string): Promise<UserModel | void> {
		try {
			return await this.prismaService.client.userModel.update({
				where: {
					id: userId,
				},
				data: {
					userName: newName,
				},
			});
		} catch (e) {
			if (e instanceof Error) {
				throw new Error(e.message);
			}
		}
	}

	async changeEmail(userId: number, newEmail: string): Promise<void> {
		try {
			// ...
		} catch (e) {
			if (e instanceof Error) {
				throw new Error(e.message);
			}
		}
	}

	async changePass(userId: number, newPass: string): Promise<UserModel | void> {
		try {
			return await this.prismaService.client.userModel.update({
				where: {
					id: userId,
				},
				data: {
					password: newPass,
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
