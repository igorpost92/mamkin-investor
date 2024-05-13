import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Broker } from './broker';
import { Asset } from './asset';

@Entity('sells')
export class Sell {
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
  quantity!: number;

  @Column('numeric')
  price!: number;

  @Column('numeric')
  sum!: number;

  @Column('numeric', { nullable: true })
  commission?: number;

  @Column('text', { nullable: true })
  brokerTransactionId?: string;
}

export type NewSell = Omit<Sell, 'id'> & {
  id?: string;
};
