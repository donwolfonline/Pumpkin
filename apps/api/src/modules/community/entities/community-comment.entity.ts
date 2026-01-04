import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { CommunityPost } from './community-post.entity';

@Entity('community_comments')
export class CommunityComment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'post_id' })
    postId: string;

    @ManyToOne(() => CommunityPost, (post) => post.comments)
    @JoinColumn({ name: 'post_id' })
    post: CommunityPost;

    @Column({ name: 'author_id' })
    authorId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'author_id' })
    author: User;

    @Column('text')
    content: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
