import jwt from 'jsonwebtoken'
import { PSQL } from '@/configs/db.config'
import { User } from '@/entities/user.entity'
import { PayloadToken, RegisterBody, ResponseLogin } from '@/interfaces/auth.interface'
import NotFound from '@/middlewares/exception/Notfound'
import { envConfig } from '@/configs/env.config'

class AuthService {
  constructor() {}

  async login(username: string, password: string): Promise<ResponseLogin> {
    const user = await PSQL.createQueryBuilder(User, 'user')
      .where('user.username = :username', { username })
      .select(['user.id', 'user.password', 'user.username', 'user.full_name', 'user.email'])
      .getOne()

    if (!user) throw new NotFound()
    if (!user.comparePassword(password)) throw new NotFound()

    return this._generateToken({ id: user.id, email: user.email })
  }

  async register(payload: RegisterBody): Promise<ResponseLogin> {
    const { full_name, username, email, password } = payload
    const user = new User()
    user.full_name = full_name
    user.username = username
    user.email = email
    user.setPassword(password)

    await user.save()

    return this._generateToken({ id: user.id, email: user.email })
  }

  private _generateToken(payload: PayloadToken) {
    const access_token = jwt.sign(payload, envConfig.JWT_SECRET, {
      expiresIn: '1d'
    })
    const refresh_token = jwt.sign(payload, envConfig.JWT_RT_SECRET, {
      expiresIn: '20d'
    })

    return {
      access_token,
      refresh_token
    }
  }
}

export default AuthService
