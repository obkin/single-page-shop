import { inject, injectable } from 'inversify';
import { IPostsRepository } from './posts.repository.interface';
import { TYPES } from '../types';
import { PrismaService } from '../database/prisma.service';
import { PostModel } from '@prisma/client';
import { Post } from './post.entity';

@injectable()
export class PostsRepository implements IPostsRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create({ title, body }: Post): Promise<PostModel> {
		return this.prismaService.client.postModel.create({
			data: {
				title,
				body,
			},
		});
	}
}
