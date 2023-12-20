import { Request, Response, NextFunction, Router } from 'express';

interface IMiddleware {
	exec: (req: Request, res: Response, next: NextFunction) => void;
}

export { IMiddleware };
