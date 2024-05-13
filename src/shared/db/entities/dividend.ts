import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Broker } from './broker';
import { Asset } from './asset';

@Entity('dividends')
export class Dividend {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('timestamptz')
  date!: Date;

  // TODO:
  @Column('timestamptz', { nullable: true })
  closeDate?: Date;

  @ManyToOne(() => Broker, {
    // TODO:
    // onDelete: 'CASCADE'
  })
  broker!: Broker;

  @Column()
  brokerId!: string;

  @ManyToOne(() => Asset, {
    // TODO:
    // onDelete: 'CASCADE'
  })
  asset!: Asset;

  @Column()
  assetId!: string;

  @Column('text')
  currency!: string;

  @Column('numeric')
  sum!: number;

  @Column('numeric', { nullable: true })
  sumRub?: number;

  @Column('numeric', { nullable: true })
  commission?: number;

  @Column('text', { nullable: true })
  brokerTransactionId?: string;
}

export type NewDividend = Omit<Dividend, 'id'> & {
  id?: string;
};
