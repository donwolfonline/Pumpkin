import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Organization } from '../../tenant/entities/organization.entity';

@Entity('sched_booking_types')
export class BookingType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id' })
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ length: 255 })
  name: string;

  @Column({ unique: true, length: 100 })
  slug: string;

  @Column({ type: 'integer', comment: 'Duration in minutes' })
  duration: number;

  @Column({ type: 'integer', nullable: true, comment: 'Price in cents' })
  price: number;

  @Column({ name: 'buffer_before', type: 'integer', default: 0 })
  bufferBefore: number;

  @Column({ name: 'buffer_after', type: 'integer', default: 0 })
  bufferAfter: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
