import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { CommunityComment } from './community-comment.entity';

@Entity('community_posts')
export class CommunityPost {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'author_id' })
    authorId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'author_id' })
    author: User;

    @Column('text')
    content: string;

    @Column({
        type: 'varchar',
        default: 'POST'
    })
    type: string;

    @Column({ nullable: true })
    imageUrl?: string;

    @Column({ default: true })
    isPublic: boolean;

    @Column({ name: 'likes_count', default: 0 })
    likesCount: number;

    @Column('simple-json', { name: 'liked_by', nullable: true })
    likedBy: string[];

    @OneToMany(() => CommunityComment, (comment) => comment.post)
    comments: CommunityComment[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
