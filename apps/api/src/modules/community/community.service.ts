import { Injectable, ForbiddenException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityPost } from './entities/community-post.entity';
import { CommunityComment } from './entities/community-comment.entity';
import { CreatePostDto, CreateCommentDto } from './dto/community.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class CommunityService {
    private readonly logger = new Logger(CommunityService.name);

    constructor(
        @InjectRepository(CommunityPost)
        private postRepository: Repository<CommunityPost>,
        @InjectRepository(CommunityComment)
        private commentRepository: Repository<CommunityComment>,
    ) { }

    async getPosts() {
        return this.postRepository.find({
            where: { isPublic: true },
            relations: ['author', 'comments', 'comments.author'],
            order: { createdAt: 'DESC' },
        });
    }

    async getPostById(id: string) {
        const post = await this.postRepository.findOne({
            where: { id },
            relations: ['author', 'comments', 'comments.author'],
        });
        if (!post) throw new NotFoundException('Post not found');
        return post;
    }

    async createPost(user: User, createPostDto: CreatePostDto): Promise<CommunityPost> {
        if (createPostDto.type === 'ANNOUNCEMENT' && user.role !== 'super_admin') {
            throw new ForbiddenException('Only super admins can create announcements');
        }

        const post = this.postRepository.create({
            ...createPostDto,
            author: user,
            authorId: user.id,
        });
        return this.postRepository.save(post);
    }

    async toggleLike(user: User, id: string) {
        const post = await this.getPostById(id);
        const likedBy = post.likedBy || [];
        const userIndex = likedBy.indexOf(user.id);

        if (userIndex > -1) {
            likedBy.splice(userIndex, 1);
            post.likesCount = Math.max(0, post.likesCount - 1);
        } else {
            likedBy.push(user.id);
            post.likesCount += 1;
        }

        post.likedBy = likedBy;
        return this.postRepository.save(post);
    }

    async addComment(user: User, postId: string, createCommentDto: CreateCommentDto) {
        const post = await this.getPostById(postId);
        const comment = this.commentRepository.create({
            ...createCommentDto,
            author: user,
            authorId: user.id,
            post,
        });
        return this.commentRepository.save(comment);
    }

    async deletePost(user: User, id: string) {
        const post = await this.getPostById(id);
        if (post.authorId !== user.id && user.role !== 'super_admin') {
            throw new ForbiddenException('You can only delete your own posts');
        }
        return this.postRepository.remove(post);
    }
}
