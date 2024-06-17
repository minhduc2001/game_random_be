import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm'

export abstract class AbstractEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
