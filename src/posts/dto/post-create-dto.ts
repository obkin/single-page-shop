import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class PostCreateDto {
	@IsString({ message: 'incorrect title' })
	title: string;

	@IsString({ message: 'incorrect body' })
	body: string;

	@IsInt({ message: 'userId must be an integer' })
	@IsNotEmpty({ message: 'userId is required' })
	userId: number;
}
