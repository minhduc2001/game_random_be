import { Column, Entity, JoinColumn, OneToMany } from 'typeorm'
import { AbstractEntity } from './base.entity'
import { SessionGame } from './session_game.entity'

@Entity()
export class Server extends AbstractEntity {
  @Column()
  name: string

  @OneToMany(() => SessionGame, (sg) => sg.server_game)
  session_games: SessionGame[]
}
