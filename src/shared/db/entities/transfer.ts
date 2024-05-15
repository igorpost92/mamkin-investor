import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Broker } from './broker';
import { Asset } from './asset';

@Entity('transfers')
export class Transfer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('timestamptz')
  date!: Date;

  @ManyToOne(() => Broker, {
    // TODO:
    // onDelete: 'CASCADE'
  })
  brokerFrom!: Broker;

  @Column()
  brokerFromId!: string;

  @ManyToOne(() => Broker, {
    // TODO:
    // onDelete: 'CASCADE'
  })
  brokerTo!: Broker;

  @Column()
  brokerToId!: string;

  @ManyToOne(() => Asset, {
    // TODO:
    // onDelete: 'CASCADE'
  })
  asset!: Asset;

  @Column()
  assetId!: string;

  @Column()
  quantity!: number;
}

export type NewTransfer = Omit<Transfer, 'id' | 'brokerFrom' | 'brokerTo' | 'asset'> & {
  id?: string;
};
