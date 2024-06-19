import { Router } from 'express'
import UserController from '@/controllers/user.controller'
import validationMiddleware from '@/middlewares/validation.middleware'
import { ListUser } from '@/dtos/user.dto'
import { verifyToken } from '@/middlewares/auth.middleware'

const userController = new UserController()

const router: Router = Router()

router.get('/', validationMiddleware(ListUser), userController.loggingIn)
router.get('/get-me', verifyToken, userController.getMe)

export default router
