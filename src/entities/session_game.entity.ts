import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { Server } from './server.entity'
import { Transaction } from './transaction.entity'
import { AbstractEntity } from './base.entity'

@Entity()
export class SessionGame extends AbstractEntity {
  @Column({ type: 'boolean', nullable: true, default: null })
  res_cl: boolean

  @Column({ type: 'boolean', nullable: true, default: null })
  res_tx: boolean

  @Column({ nullable: true, default: 0 })
  coin_random: number

  @Column({ nullable: true, default: 100 })
  res_percent: number

  @Column({ nullable: true, default: 0 })
  coin: number

  @Column({ nullable: true, default: 0 })
  total_coin: number

  @Column({ nullable: true })
  coin_prev: number

  @Column({ nullable: true, default: 0 })
  coin_prev_total: number

  @Column({ type: 'boolean', default: true })
  active: boolean

  @ManyToOne(() => Server, (sv) => sv.session_games)
  @JoinColumn({ name: 'server_id' })
  server_game: Server

  @OneToMany(() => Transaction, (transaction) => transaction.session_game)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction

  server: number
  server_name: string

  setTotalCoin() {
    this.total_coin = this.coin + this.coin_prev + this.coin_random
  }

  setResCoin() {
    const total = String(this.total_coin)
      .split('')
      .reduce((pre, cur) => pre + Number.parseInt(cur), 0)

    this.res_cl = false
    this.res_tx = false

    if (Number.parseInt(total.toString().at(-1)) >= 5) this.res_tx = true
    if (total % 2 == 0) this.res_cl = true
  }

  @AfterLoad()
  afterload() {
    if (this.server_game) {
      this.server_name = this.server_game.name
      this.server = this.server_game.id
    }
  }
}
