import { IsNotEmpty, IsEmail, Length } from 'class-validator';

export class UserRegisterDto {
	@IsNotEmpty({ message: 'Name must not be empty' })
	name: string;

	@IsNotEmpty({ message: 'Email must not be empty' })
	@IsEmail({}, { message: 'Invalid email format' })
	email: string;

	@IsNotEmpty({ message: 'Password must not be empty' })
	@Length(8, 80, { message: 'Password must be between 8 and 80 characters' })
	password: string;
}
