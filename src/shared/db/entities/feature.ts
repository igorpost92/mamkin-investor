import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('features')
export class Feature {
  @PrimaryColumn({ default: true })
  enabled!: boolean;

  @Column({ nullable: true })
  registrationEnabled?: boolean;
}

export type FeaturesConfig = Omit<Feature, 'enabled'>;
