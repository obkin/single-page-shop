import { IsNotEmpty, IsEmail } from 'class-validator';

export class UserRegisterDto {
	@IsNotEmpty({ message: 'Name must not be empty' })
	name: string;

	@IsNotEmpty({ message: 'Email must not be empty' })
	@IsEmail({}, { message: 'Invalid email format' })
	email: string;

	@IsNotEmpty({ message: 'Password must not be empty' })
	password: string;
}
