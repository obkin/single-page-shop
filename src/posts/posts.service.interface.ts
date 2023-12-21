import { PostModel } from '@prisma/client';
import { PostCreateDto } from './dto/post-create-dto';

interface IPostsService {
	createPost(dto: PostCreateDto): Promise<PostModel>;
}

export { IPostsService };
