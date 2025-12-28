import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Unique,
} from 'typeorm';
import { User } from '../../../modules/auth/entities/user.entity';
import { NotificationCategory } from './notification.entity';

@Entity('user_notification_preferences')
@Unique(['userId', 'category'])
export class UserNotificationPreference {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({
        type: 'varchar',
        length: 50,
    })
    category: NotificationCategory;

    @Column({ default: true })
    emailEnabled: boolean;

    @Column({ default: true })
    inAppEnabled: boolean;

    @Column({ default: false })
    smsEnabled: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
