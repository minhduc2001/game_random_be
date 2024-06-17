import { Column, Entity } from 'typeorm'
import { ERole } from '@/enums/role.enum'

import * as bcrypt from 'bcrypt'
import { AbstractEntity } from './base.entity'

@Entity()
export class User extends AbstractEntity {
  @Column({ unique: true })
  username: string

  @Column({ nullable: true })
  full_name: string

  @Column({ nullable: true })
  phone: string

  @Column({ select: false })
  password: string

  @Column({ unique: true })
  email: string

  @Column({ nullable: true })
  avatar: string

  @Column({ default: 500000 })
  coin: number

  @Column({ nullable: false, type: 'enum', enum: ERole, default: ERole.User })
  role: ERole

  setPassword(password: string) {
    this.password = bcrypt.hashSync(password, 10)
  }

  comparePassword(rawPassword: string): boolean {
    const userPassword = this.password
    return bcrypt.compareSync(rawPassword, userPassword)
  }
}
