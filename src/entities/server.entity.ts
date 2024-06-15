import { Column, JoinColumn, OneToMany } from 'typeorm'
import { BaseEntity } from './base.entity'
import { SessionGame } from './session_game.entity'

export class Server extends BaseEntity {
  @Column()
  name: string

  @OneToMany(() => SessionGame, (sg) => sg.transaction)
  @JoinColumn({ referencedColumnName: 'server_id' })
  session_games: SessionGame[]
}
