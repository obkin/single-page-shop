import { IsString, IsNotEmpty } from 'class-validator';

export class PostCreateDto {
	@IsString({ message: 'title must be a string' })
	@IsNotEmpty({ message: 'title is required' })
	title: string;

	@IsString({ message: 'body must be a string' })
	@IsNotEmpty({ message: 'body is required' })
	body: string;

	@IsString({ message: 'userId must be a string' })
	@IsNotEmpty({ message: 'userId is required' })
	userId: string;
}
