import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity as TBaseEntity } from 'typeorm'

export abstract class BaseEntity extends TBaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
