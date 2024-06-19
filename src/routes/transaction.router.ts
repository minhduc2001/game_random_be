import { Router } from 'express'
import TransactionController from '@/controllers/transaction.controller'
import { verifyToken } from '@/middlewares/auth.middleware'

const transactionController = new TransactionController()
const router: Router = Router()

router.post('/bet', verifyToken, transactionController.bet)

export default router
