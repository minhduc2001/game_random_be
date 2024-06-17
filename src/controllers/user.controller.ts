import { Request, Response, NextFunction, Router } from 'express'
import BadRequest from '@/middlewares/exception/BadRequest'
import UserService from '@/services/user.service'

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
}

export default UserController
