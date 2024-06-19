import { Request, Response, NextFunction, Router } from 'express'
import BadRequest from '@/middlewares/exception/BadRequest'
import UserService from '@/services/user.service'
import { CustomRequest } from '@/middlewares/auth.middleware'

class UserController {
  private userService: UserService
  constructor() {
    this.userService = new UserService()
  }
  async loggingIn(request: Request, response: Response, next: NextFunction) {
    try {
      const data = this.userService.getAll()

      response.customSuccess(200, data)
    } catch (e) {
      return next(e)
    }
  }

  async getMe(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      res.customSuccess(200, req.user)
    } catch (e) {
      return next(e)
    }
  }
}

export default UserController
