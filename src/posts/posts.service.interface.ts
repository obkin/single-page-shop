import { PostModel } from '@prisma/client';
import { PostCreateDto } from './dto/post-create-dto';

interface IPostsService {
	createPost(dto: PostCreateDto): Promise<PostModel | void>;
	getAllPosts(): Promise<any | void>;
	removePost(id: number): Promise<any | void>;
}

export { IPostsService };
