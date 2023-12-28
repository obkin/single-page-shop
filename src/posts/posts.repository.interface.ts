import { PostModel } from '@prisma/client';
import { Post } from './post.entity';

interface IPostsRepository {
	create: (post: Post) => Promise<PostModel>;
	findOne: (postId: number) => Promise<PostModel | null>;
	findMany: () => Promise<any>;
	remove: (id: number) => Promise<any>;
	update: (postId: number, updatedPost: Post) => Promise<PostModel>;
}

export { IPostsRepository };
