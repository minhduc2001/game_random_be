import { Router } from 'express'
import AuthController from '@/controllers/auth.controller'

const authController = new AuthController()
const router: Router = Router()

router.post('/login', authController.login)
router.post('/register', authController.register)

export default router
