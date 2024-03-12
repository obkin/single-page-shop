import { UserModel } from '@prisma/client';
import { User } from './user.entity';

interface IUsersRepository {
	create: (user: User) => Promise<UserModel | void>;
	findByEmail: (email: string) => Promise<UserModel | null | void>;
	findById: (userId: number) => Promise<UserModel | null | void>;

	changeName: (userId: number, newName: string) => Promise<UserModel | void>;
	changeEmail: (userId: number, newEmail: string) => Promise<void>;
	changePass: (userId: number, newPass: string) => Promise<UserModel | void>;
}

export { IUsersRepository };
