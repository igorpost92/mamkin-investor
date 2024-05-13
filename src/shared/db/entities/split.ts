import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Asset } from './asset';

@Entity('splits')
export class Split {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('timestamptz')
  date!: Date;

  @ManyToOne(() => Asset, {
    // TODO:
    // onDelete: 'CASCADE'
  })
  asset!: Asset;

  @Column()
  assetId!: string;

  // TODO:
  @Column('numeric')
  ratio!: number;

  // TODO: need? the only case is SPBE
  // currency: text('currency').notNull(),
}

export type NewSplit = Omit<Split, 'id'> & {
  id?: string;
};
