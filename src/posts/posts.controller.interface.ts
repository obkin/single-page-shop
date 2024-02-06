import { NextFunction, Request, Response } from 'express';

interface IPostsController {
	addPost: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getPost: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getPosts: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getUserPosts: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	removePost: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	updatePost: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export { IPostsController };
