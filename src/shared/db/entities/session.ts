import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('timestamptz')
  date!: Date;

  @ManyToOne(() => User)
  user!: User;

  @Column()
  userId!: string;
}
