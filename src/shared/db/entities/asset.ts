import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  name!: string;

  // TODO: text
  @Column('text', { nullable: true })
  ticker?: string;

  @Column('text', { nullable: true })
  isin?: string;

  @Column('text', { nullable: true })
  currency?: string;

  @Column('text', { nullable: true })
  type?: string;

  @Column('text', { nullable: true })
  uid?: string;

  @Column('text', { nullable: true })
  instrumentUid?: string;
}

export type NewAsset = Omit<Asset, 'id'> & {
  id?: string;
};
