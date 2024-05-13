import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('brokers')
export class Broker {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // TODO: text
  @Column('text')
  name!: string;
}
