import { NextFunction, Request } from 'express'
import Authorization from './exception/Authorization'
import { envConfig } from '@/configs/env.config'
import jwt from 'jsonwebtoken'
import ServiceUnavailableException from './exception/ServiceUnavailableException'
import UserService from '@/services/user.service'
import { User } from '@/entities/user.entity'
import { ERole } from '@/enums/role.enum'

export interface CustomRequest extends Request {
  user?: User
}

class VerifyJWTToken {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  async verifyToken(req: CustomRequest, res: Response, next: NextFunction) {
    const token: string = (req.headers.token as string) || (req.headers.authorization as string)

    if (token) {
      const accessToken = token.split(' ')[1]
      jwt.verify(accessToken, envConfig.JWT_SECRET, async (err: any, userDecode: User) => {
        if (err) {
          return next(new Authorization({ message: 'Mã xác thực không đúng' }))
        }

        try {
          const user = await this.userService.getUserForAuth(userDecode?.id)
          req.user = user
        } catch (error: any) {
          return next(new ServiceUnavailableException())
        }

        return next()
      })
    } else {
      return next(new Authorization({ message: 'Bạn cần có mã xác thực' }))
    }
  }

  async verifyTokenAndAdmin(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      await this.verifyToken(req, res, async () => {
        if (req?.user?.id && req?.user?.role == ERole.SuperAdmin) {
          return next()
        } else {
          return next(
            new Authorization({
              message: 'Bạn không có quyền truy cập nội dung này!'
            })
          )
        }
      })
    } catch (error) {
      return next(error)
    }
  }
}

const auth = new VerifyJWTToken()
export default auth
