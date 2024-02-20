import { UserModel } from '@prisma/client';
import { User } from './user.entity';

interface IUsersRepository {
	create: (user: User) => Promise<UserModel | void>;
	find: (email: string) => Promise<UserModel | null | void>;

	changeName: (userId: number, newName: string) => Promise<UserModel | void>;
	changeEmail: (userId: number, newEmail: string) => Promise<void>;
	changePass: (userId: number, newPass: string) => Promise<void>;
}

export { IUsersRepository };
