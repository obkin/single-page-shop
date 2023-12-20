import { PostCreateDto } from './dto/post-create-dto';

interface IPostsService {
	createPost(dto: PostCreateDto) => ;
}

export { IPostsService };
