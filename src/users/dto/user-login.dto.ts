import { IsEmail, IsString, Length } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Invalid email format' })
	email: string;

	@IsString({ message: 'Invalid password format' })
	@Length(8, 80, { message: 'Password must be between 8 and 80 characters' })
	password: string;
}
