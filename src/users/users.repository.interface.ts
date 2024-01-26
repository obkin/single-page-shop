import { UserModel } from '@prisma/client';
import { User } from './user.entity';

interface IUsersRepository {
	create: (user: User) => Promise<UserModel | void>;
	find: (email: string) => Promise<UserModel | null | void>;
}

export { IUsersRepository };
