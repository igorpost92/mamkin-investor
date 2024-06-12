import { Check, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('features')
@Check(`enabled = true`)
export class Feature {
  @PrimaryColumn({ default: true })
  enabled!: boolean;

  @Column({ nullable: true })
  registrationEnabled?: boolean;
}

export type FeaturesConfig = Omit<Feature, 'enabled'>;
