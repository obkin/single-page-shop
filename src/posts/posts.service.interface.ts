import { PostModel } from '@prisma/client';
import { PostCreateDto } from './dto/post-create-dto';
import { Post } from './post.entity';

interface IPostsService {
	createPost(dto: PostCreateDto): Promise<PostModel | void>;
	getAllPosts(): Promise<any | void>;
	removePost(id: number): Promise<any | void>;
	updatePost(postId: number, updatedData: Post): Promise<PostModel | void>;
}

export { IPostsService };
