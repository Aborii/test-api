import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('customers')
@Index('IDX_customers_created_at', ['createdAt'])
@Index('IDX_customers_email', ['email'])
@Index('IDX_customers_full_name', ['fullName'])
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'full_name', length: 255 })
  fullName: string;

  @Column({ type: 'varchar', length: 255, unique: true, name: 'email' })
  email: string;

  @Column({ type: 'varchar', length: 50, name: 'phone_number' })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 100, select: false, name: 'national_id' })
  nationalId: string;

  @Column({
    type: 'text',
    nullable: true,
    select: false,
    name: 'internal_notes',
  })
  internalNotes: string | null;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
