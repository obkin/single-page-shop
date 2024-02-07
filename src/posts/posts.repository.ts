import { inject, injectable } from 'inversify';
import { IPostsRepository } from './posts.repository.interface';
import { TYPES } from '../types';
import { PrismaService } from '../database/prisma.service';
import { PostModel } from '@prisma/client';
import { Post } from './post.entity';

@injectable()
export class PostsRepository implements IPostsRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create({ title, body, userId }: Post): Promise<PostModel | void> {
		try {
			return await this.prismaService.client.postModel.create({
				data: {
					title,
					body,
					userId,
				},
			});
		} catch (e) {
			if (e instanceof Error) {
				throw new Error(e.message);
			}
		}
	}

	async findOne(postId: number): Promise<PostModel | null> {
		try {
			return await this.prismaService.client.postModel.findFirst({
				where: {
					id: postId,
				},
			});
		} catch (e) {
			if (e instanceof Error) {
				throw new Error(e.message);
			}
			return null;
		}
	}

	async findMany(limit?: number, pages?: number, userId?: number): Promise<any> {
		console.log(userId);
		if (userId) {
			try {
				return await this.prismaService.client.postModel.findMany({
					where: {
						userId,
					},
					take: limit || 100,
					skip: pages,
				});
			} catch (e) {
				if (e instanceof Error) {
					throw new Error(e.message);
				}
			}
		} else {
			try {
				return await this.prismaService.client.postModel.findMany({
					take: limit || 100,
					skip: pages,
				});
			} catch (e) {
				if (e instanceof Error) {
					throw new Error(e.message);
				}
			}
		}
	}

	async remove(postId: number): Promise<any> {
		try {
			return await this.prismaService.client.postModel.delete({
				where: {
					id: postId,
				},
			});
		} catch (e) {
			if (e instanceof Error) {
				throw new Error(e.message);
			}
		}
	}

	async update(postId: number, { title, body }: Post): Promise<PostModel | void> {
		try {
			return await this.prismaService.client.postModel.update({
				where: {
					id: postId,
				},
				data: {
					title,
					body,
				},
			});
		} catch (e) {
			if (e instanceof Error) {
				throw new Error(e.message);
			}
		}
	}
}
