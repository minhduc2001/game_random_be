import { Router } from 'express'
import userRouter from './user.router'
import authRouter from './auth.router'
import transactionRouter from './transaction.router'

const router: Router = Router()
router.use('/user', userRouter)
router.use('/auth', authRouter)
router.use('/transaction', transactionRouter)

export default router
