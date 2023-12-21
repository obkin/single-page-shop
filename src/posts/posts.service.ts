import { PostModel } from '@prisma/client';
import { PostCreateDto } from './dto/post-create-dto';
import { IPostsService } from './posts.service.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IPostsRepository } from './posts.repository.interface';
import { ILogger } from '../logger/logger.interface';
import { Post } from './post.entity';

@injectable()
export class PostsService implements IPostsService {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.PostsRepoitory) private postsRepository: IPostsRepository,
	) {}

	async createPost({ title, body }: PostCreateDto): Promise<PostModel> {
		const newPost = new Post(title, body);
		return await this.postsRepository.create(newPost);
	}

	async getAllPosts(): Promise<any> {
		return await this.postsRepository.findMany();
	}
}
