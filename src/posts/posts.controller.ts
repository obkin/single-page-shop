import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { IPostsController } from './posts.controller.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { IPostsService } from './posts.service.interface';
import { PostCreateDto } from './dto/post-create-dto';

@injectable()
export class PostsController extends BaseController implements IPostsController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.PostsService) private postsService: IPostsService,
	) {
		super(loggerService);

		this.bindRoutes([
			{
				path: '/get-posts',
				method: 'get',
				func: this.getPosts,
				middlewares: [],
			},
			{
				path: '/add-post',
				method: 'post',
				func: this.addPost,
				middlewares: [],
			},
			{
				path: '/remove-post/:id',
				method: 'delete',
				func: this.removePost,
				middlewares: [],
			},
		]);
	}

	async addPost(
		req: Request<{}, {}, PostCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.postsService.createPost(req.body);
		if (!result) {
			this.loggerService.error('[PostsController]: failed to create post');
		} else {
			this.ok(res, `{ title: ${result.title}, body: ${result.body} }`);
			this.loggerService.log('[PostsController]: new post created');
		}
	}

	async getPosts(
		req: Request<{}, {}, PostCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.postsService.getAllPosts();
		if (!result) {
			this.loggerService.error('[PostsController]: failed to get posts');
		} else {
			this.ok(res, result);
			this.loggerService.log('[PostsController]: posts sent');
		}
	}

	async removePost(req: Request, res: Response, next: NextFunction): Promise<void> {
		const result = await this.postsService.removePost(Number(req.params.id));
		if (!result) {
			this.loggerService.error('[PostsController]: failed to delete post');
		} else {
			this.ok(res, `Post #${req.params.id} was deleted`);
			this.loggerService.log(`[PostsController]: post #${req.params.id} was deleted`);
		}
	}
}
