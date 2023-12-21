import { PostModel } from '@prisma/client';
import { Post } from './post.entity';

interface IPostsRepository {
	create: (post: Post) => Promise<PostModel>;
	findMany: () => Promise<PostModel>;
}

export { IPostsRepository };
