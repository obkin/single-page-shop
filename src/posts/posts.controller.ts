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
				path: '/add',
				method: 'post',
				func: this.addPost,
				middlewares: [],
			},
		]);
	}

	async getPosts(
		req: Request<{}, {}, PostCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		this.ok(res, 'get works');
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
}
