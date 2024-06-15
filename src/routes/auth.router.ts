import { Router } from 'express'
import validationMiddleware from '@/middlewares/validation.middleware'
import { ListUser } from '@/dtos/user.dto'
import AuthController from '@/controllers/auth.controller'

const authController = new AuthController()
const router: Router = Router()

router.get('/login', validationMiddleware(ListUser), authController.login)
router.get('/register', authController.register)

export default router
