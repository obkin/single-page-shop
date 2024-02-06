import { PostModel } from '@prisma/client';
import { Post } from './post.entity';

interface IPostsRepository {
	create: (post: Post) => Promise<PostModel | void>;
	findOne: (postId: number) => Promise<PostModel | null>;
	findMany: (userId?: number, limit?: number, pages?: number) => Promise<any>;
	remove: (id: number) => Promise<any>;
	update: (postId: number, updatedPost: Post) => Promise<PostModel | void>;
}

export { IPostsRepository };
