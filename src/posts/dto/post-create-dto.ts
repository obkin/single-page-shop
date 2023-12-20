import { IsString } from 'class-validator';

export class PostCreateDto {
	@IsString({ message: 'incorrect title' })
	title: string;

	@IsString({ message: 'incorrect body' })
	body: string;
}
