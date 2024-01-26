import { UserModel } from '@prisma/client';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';

interface IUsersService {
	createUser(dto: UserRegisterDto): Promise<UserModel | null | void>;
	validateUser(dto: UserLoginDto): Promise<boolean | void>;
	findUser(email: string): Promise<UserModel | null | void>;
}

export { IUsersService };
