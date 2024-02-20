import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { IPostsController } from './posts.controller.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { IPostsService } from './posts.service.interface';
import { PostCreateDto } from './dto/post-create-dto';
import { HTTPError } from '../exceptions/http-error.class';
import { ValidateMiddleware } from '../common/validate.middleware';
import { AuthGuardMiddleware } from '../common/auth.guard';

@injectable()
export class PostsController extends BaseController implements IPostsController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.PostsService) private postsService: IPostsService,
	) {
		super(loggerService);

		this.bindRoutes([
			{
				main: '/posts',
				path: '/add-post',
				method: 'post',
				func: this.addPost,
				middlewares: [new ValidateMiddleware(PostCreateDto), new AuthGuardMiddleware()],
			},
			{
				main: '/posts',
				path: '/get-post/:id',
				method: 'get',
				func: this.getPost,
				middlewares: [],
			},
			{
				main: '/posts',
				path: '/get-posts',
				method: 'get',
				func: this.getPosts,
				middlewares: [],
			},
			{
				main: '/posts',
				path: '/get-user-posts',
				method: 'get',
				func: this.getUserPosts,
				middlewares: [],
			},
			{
				main: '/posts',
				path: '/remove-post/:id',
				method: 'delete',
				func: this.removePost,
				middlewares: [],
			},
			{
				main: '/posts',
				path: '/update-post/:id',
				method: 'put',
				func: this.updatePost,
				middlewares: [],
			},
		]);
	}

	async addPost(
		req: Request<{}, {}, PostCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.postsService.createPost(req.body, Number(req.userId));
		if (!result) {
			next(new HTTPError(400, 'failed to create post', 'PostsController -> addPost'));
		} else {
			this.created(res, {
				newPost: {
					id: result.id,
					title: result.title,
					body: result.body,
					createdAt: result.createdAt,
					// updatedAt: result.updatedAt,
					ownerId: result.userId,
				},
			});
			this.loggerService.log('[PostsController]: new post created');
		}
	}

	async getPost(req: Request, res: Response, next: NextFunction): Promise<void> {
		const result = await this.postsService.getOnePost(Number(req.params.id));
		if (!result) {
			next(new HTTPError(404, `post #${req.params.id} not found`, 'PostsController -> getPost'));
		} else {
			this.ok(res, result);
			this.loggerService.log('[PostsController]: post sent');
		}
	}

	async getPosts(
		req: Request<{}, {}, {}, { limit?: string; page?: string }>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const totalCount = await this.postsService.getAllPosts();

		if (req.query.limit) {
			const result = await this.postsService.getAllPosts(
				Number(req.query.limit),
				Number(req.query.page),
			);

			if (!result || result.length === 0) {
				next(new HTTPError(404, 'posts not found', 'PostsController -> getPosts with limit'));
			} else {
				this.ok(res, result, totalCount.length);
				this.loggerService.log('[PostsController]: posts sent');
			}
		} else {
			const result = await this.postsService.getAllPosts();

			if (!result || result.length === 0) {
				next(new HTTPError(404, 'posts not found', 'PostsController -> getPosts'));
			} else {
				this.ok(res, result, totalCount.length);
				this.loggerService.log('[PostsController]: posts sent');
			}
		}
	}

	async getUserPosts(
		req: Request<{}, {}, {}, { limit?: string; page?: string }>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const totalCount = await this.postsService.getAllUserPosts(Number(req.userId));

		if (req.userId) {
			const result = await this.postsService.getAllUserPosts(
				Number(req.userId),
				Number(req.query.limit),
				Number(req.query.page),
			);

			if (!result) {
				next(new HTTPError(404, `posts not found`, 'PostsController -> getUserPosts'));
			} else {
				this.ok(res, result, totalCount.length);
				this.loggerService.log(`[PostsController]: posts sent to user`);
			}
		} else {
			next(new HTTPError(401, 'user is not authorized', 'PostsController -> getUserPosts'));
		}
	}

	async removePost(req: Request, res: Response, next: NextFunction): Promise<void> {
		const result = await this.postsService.removePost(Number(req.params.id));
		if (!result) {
			next(new HTTPError(404, `post #${req.params.id} not found`, 'PostsController -> removePost'));
		} else {
			this.deleted(res, { message: `Post #${req.params.id} was deleted` });
			this.loggerService.log(`[PostsController]: post #${req.params.id} was deleted`);
		}
	}

	async updatePost(req: Request, res: Response, next: NextFunction): Promise<void> {
		const result = await this.postsService.updatePost(Number(req.params.id), req.body);
		if (!result) {
			next(new HTTPError(404, `post #${req.params.id} not found`, 'PostsController -> updatePost'));
		} else {
			this.ok(res, { message: `Post #${req.params.id} was updated` });
			this.loggerService.log(`[PostsController]: post #${req.params.id} was updated`);
		}
	}
}
