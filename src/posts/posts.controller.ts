import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { IPostsController } from './posts.controller.interface';

export class PostsController extends BaseController implements IPostsController {
	async getPosts(req: Request, res: Response, next: NextFunction): Promise<void> {}
}
