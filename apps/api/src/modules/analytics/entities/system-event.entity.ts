import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
} from 'typeorm';

export enum EventCategory {
    REVENUE = 'REVENUE',
    CRM = 'CRM',
    SYSTEM = 'SYSTEM',
    FLOW = 'FLOW',
}

@Entity('system_events')
export class SystemEvent {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'organization_id' })
    @Index()
    organizationId: string;

    @Column({ name: 'user_id', nullable: true })
    @Index()
    userId: string;

    @Column({ length: 100 })
    @Index()
    eventName: string;

    @Column({
        type: 'varchar',
        length: 50,
    })
    category: EventCategory;

    @Column({ type: 'simple-json', default: '{}' })
    properties: Record<string, any>;

    @CreateDateColumn({ name: 'timestamp' })
    @Index()
    timestamp: Date;
}
