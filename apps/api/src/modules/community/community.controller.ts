import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreatePostDto, CreateCommentDto } from './dto/community.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';

@Controller('community')
@UseGuards(JwtAuthGuard)
export class CommunityController {
    constructor(private readonly communityService: CommunityService) { }

    @Public()
    @Get('posts')
    getPosts() {
        return this.communityService.getPosts();
    }

    @Post('posts')
    createPost(
        @CurrentUser() { user }: AuthenticatedUser,
        @Body() createPostDto: CreatePostDto,
    ) {
        return this.communityService.createPost(user as any, createPostDto);
    }

    @Public()
    @Get('posts/:id')
    getPost(@Param('id') id: string) {
        return this.communityService.getPostById(id);
    }

    @Post('posts/:id/like')
    toggleLike(@CurrentUser() { user }: AuthenticatedUser, @Param('id') id: string) {
        return this.communityService.toggleLike(user as any, id);
    }

    @Post('posts/:id/comments')
    addComment(
        @CurrentUser() { user }: AuthenticatedUser,
        @Param('id') id: string,
        @Body() createCommentDto: CreateCommentDto,
    ) {
        return this.communityService.addComment(user as any, id, createCommentDto);
    }

    @Delete('posts/:id')
    deletePost(
        @CurrentUser() { user }: AuthenticatedUser,
        @Param('id') id: string,
    ) {
        return this.communityService.deletePost(user as any, id);
    }
}
