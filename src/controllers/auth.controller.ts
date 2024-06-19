import AuthService from '@/services/auth.service'
import { NextFunction, Request, Response } from 'express'

class AuthController {
  constructor() {}

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body
      const authService = new AuthService()

      const tokens = await authService.login(username, password)

      res.customSuccess(200, tokens)
    } catch (error) {
      next(error)
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { full_name, username, email, password } = req.body

      const authService = new AuthService()
      const tokens = await authService.register({ full_name, username, email, password })

      res.customSuccess(200, tokens)
    } catch (error) {
      next(error)
    }
  }
}

export default AuthController
