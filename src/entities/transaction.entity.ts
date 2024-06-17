import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { AbstractEntity } from './base.entity'
import { TransactionSelect, TransactionStatus } from '@/enums/transaction.enum'
import { User } from './user.entity'
import { SessionGame } from './session_game.entity'

@Entity()
export class Transaction extends AbstractEntity {
  @Column({ default: 0 })
  xu_an: number

  @Column()
  xu_dat: number

  @Column('enum', { default: TransactionStatus.Pending, enum: TransactionStatus })
  status: TransactionStatus

  @Column('enum', { enum: TransactionSelect })
  selection: TransactionSelect

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => SessionGame, (sg) => sg.transaction)
  session_game: SessionGame
}
