import { NextFunction, Request, Response } from 'express';

interface IPostsController {
	getPosts: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export { IPostsController };
