import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Broker } from './broker';

@Entity('withdraws')
export class Withdrawal {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('timestamptz')
  date!: Date;

  @ManyToOne(() => Broker, {
    // TODO:
    // onDelete: 'CASCADE'
  })
  broker!: Broker;

  @Column()
  brokerId!: string;

  @Column('text')
  currency!: string;

  @Column('numeric')
  sum!: number;

  @Column('text', { nullable: true })
  brokerTransactionId?: string;
}

export type NewWithdrawal = Omit<Withdrawal, 'id' | 'broker'> & {
  id?: string;
};
