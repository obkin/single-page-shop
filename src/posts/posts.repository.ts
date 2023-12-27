import { inject, injectable } from 'inversify';
import { IPostsRepository } from './posts.repository.interface';
import { TYPES } from '../types';
import { PrismaService } from '../database/prisma.service';
import { PostModel } from '@prisma/client';
import { Post } from './post.entity';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class PostsRepository implements IPostsRepository {
	constructor(
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
		@inject(TYPES.ILogger) private loggerService: ILogger,
	) {}

	async create({ title, body }: Post): Promise<PostModel> {
		return this.prismaService.client.postModel.create({
			data: {
				title,
				body,
			},
		});
	}

	async findMany(): Promise<any> {
		return await this.prismaService.client.postModel.findMany();
	}

	async remove(postId: number): Promise<any> {
		return await this.prismaService.client.postModel.delete({
			where: {
				id: postId,
			},
		});
	}
}
