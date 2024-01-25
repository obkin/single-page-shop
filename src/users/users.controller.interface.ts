import { NextFunction, Request, Response } from 'express';

interface IUsersController {
	register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	// info: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export { IUsersController };
