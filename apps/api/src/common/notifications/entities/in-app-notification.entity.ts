import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { User } from '../../../modules/auth/entities/user.entity';
import { Notification } from './notification.entity';

@Entity('in_app_notifications')
export class InAppNotification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    @Index()
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'notification_id' })
    notificationId: string;

    @ManyToOne(() => Notification)
    @JoinColumn({ name: 'notification_id' })
    notification: Notification;

    @Column({ default: false })
    isRead: boolean;

    @Column({ type: 'datetime', nullable: true })
    readAt: Date | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
