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

	async createPost(post: PostCreateDto, userId: number): Promise<PostModel | void> {
		const newPost = new Post(post.title, post.body);
		try {
			return await this.postsRepository.create(newPost, userId);
		} catch (e) {
			if (e instanceof Error) {
				this.loggerService.error(`[PostsService]: ${e.message}`);
			}
		}
	}

	async getOnePost(postId: number): Promise<PostModel | null> {
		try {
			return await this.postsRepository.findOne(postId);
		} catch (e) {
			if (e instanceof Error) {
				this.loggerService.error(`[PostsService]: ${e.message}`);
			}
			return null;
		}
	}

	async getAllPosts(limit?: number, page?: number): Promise<any | void> {
		if (limit) {
			if (page) {
				const pageSize = limit;
				const pageNumber = page;
				const skip = (pageNumber - 1) * pageSize;

				try {
					return await this.postsRepository.findMany(limit, skip);
				} catch (e) {
					if (e instanceof Error) {
						this.loggerService.error(`[PostsService]: ${e.message}`);
					}
				}
			}

			try {
				return await this.postsRepository.findMany(limit);
			} catch (e) {
				if (e instanceof Error) {
					this.loggerService.error(`[PostsService]: ${e.message}`);
				}
			}
		}

		try {
			return await this.postsRepository.findMany();
		} catch (e) {
			if (e instanceof Error) {
				this.loggerService.error(`[PostsService]: ${e.message}`);
			}
		}
	}

	async getAllUserPosts(userId: number, limit?: number, page?: number): Promise<any | void> {
		if (limit) {
			if (page) {
				const pageSize = limit;
				const pageNumber = page;
				const skip = (pageNumber - 1) * pageSize;

				try {
					return await this.postsRepository.findMany(limit, skip, userId);
				} catch (e) {
					if (e instanceof Error) {
						this.loggerService.error(`[PostsService]: ${e.message}`);
					}
				}
			}

			try {
				return await this.postsRepository.findMany(limit, 0, userId);
			} catch (e) {
				if (e instanceof Error) {
					this.loggerService.error(`[PostsService]: ${e.message}`);
				}
			}
		} else {
			try {
				return await this.postsRepository.findMany(0, 0, userId);
			} catch (e) {
				if (e instanceof Error) {
					this.loggerService.error(`[PostsService]: ${e.message}`);
				}
			}
		}
	}

	async removePost(postId: number): Promise<any | void> {
		try {
			return await this.postsRepository.remove(postId);
		} catch (e) {
			if (e instanceof Error) {
				this.loggerService.error(`[PostsService]: ${e.message}`);
			}
		}
	}

	async updatePost(postId: number, updatedData: Post): Promise<PostModel | void> {
		try {
			const currentPost = await this.postsRepository.findOne(postId);

			if (currentPost) {
				try {
					const updateForPost = {
						title: updatedData.title ? updatedData.title : currentPost.title,
						body: updatedData.body ? updatedData.body : currentPost.body,
					};
					return await this.postsRepository.update(postId, updateForPost as Post);
				} catch (e) {
					if (e instanceof Error) {
						this.loggerService.error(`[PostsService]: ${e.message}`);
					}
				}
			}
		} catch (e) {
			if (e instanceof Error) {
				this.loggerService.error(`[PostsService]: ${e.message}`);
			}
		}
	}
}
