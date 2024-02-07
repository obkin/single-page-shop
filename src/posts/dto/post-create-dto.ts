import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class PostCreateDto {
	@IsString({ message: 'title must be a string' })
	@IsNotEmpty({ message: 'title is required' })
	title: string;

	@IsString({ message: 'body must be a string' })
	@IsNotEmpty({ message: 'body is required' })
	body: string;

	@IsInt({ message: 'userId must be an integer' })
	@IsNotEmpty({ message: 'userId is required' })
	userId: number;
}
