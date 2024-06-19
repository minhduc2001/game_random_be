import { CustomRequest } from '@/middlewares/auth.middleware'
import TransactionService from '@/services/transaction.service'
import { NextFunction, Request, Response } from 'express'

class TransactionController {
  private transactionService: TransactionService
  constructor() {
    this.transactionService = new TransactionService()
  }

  bet(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const { xu_dat, selection } = req.body
      res.customSuccess(200, this.transactionService.bet(xu_dat, selection, req.user))
    } catch (error) {
      next(error)
    }
  }
}

export default TransactionController
