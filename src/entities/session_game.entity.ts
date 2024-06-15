import { AfterLoad, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from './base.entity'
import { Server } from './server.entity'
import { Transaction } from './transaction.entity'

export class SessionGame extends BaseEntity {
  @Column({ type: 'boolean', nullable: true, default: null })
  res_cl: boolean

  @Column({ type: 'boolean', nullable: true, default: null })
  res_tx: boolean

  @Column({ default: 0 })
  coin_random: number

  @Column({ nullable: true })
  res_percent: number

  @Column({ nullable: true })
  coin: number

  @Column({ nullable: true })
  total_coin: number

  @Column({ nullable: true })
  coin_prev: number

  @ManyToOne(() => Server, (sv) => sv.session_games)
  server_game: Server

  @OneToMany(() => Transaction, (transaction) => transaction.session_game)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction

  server: number
  server_name: string

  setTotalCoin() {
    this.total_coin = this.coin + this.coin_prev + this.coin_random
  }

  setResCoin(coin: number) {
    const total = String(coin)
      .split('')
      .reduce((pre, cur) => pre + Number.parseInt(cur), 0)

    this.res_cl = false
    this.res_tx = false

    if (Number.parseInt(total.toString().at(-1)) >= 5) this.res_tx = true
    if (Number.parseInt(total.toString().at(-1)) % 2 == 0) this.res_cl = true
  }

  @AfterLoad()
  afterload() {
    if (this.server_game) {
      this.server_name = this.server_game.name
      this.server = this.server_game.id
    }
  }
}
