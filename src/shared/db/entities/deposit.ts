import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Broker } from './broker';

@Entity('deposits')
export class Deposit {
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

export type NewDeposit = Omit<Deposit, 'id' | 'broker'> & {
  id?: string;
};
