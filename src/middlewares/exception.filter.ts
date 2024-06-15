import { NextFunction, Request, Response } from 'express'
import HttpException from '@/utils/httpException'
import logger from '@/configs/logger.config'

function exceptionFilter(error: HttpException, req: Request, res: Response, next: NextFunction) {
  const status = error.status || 500
  const message = error.message || 'Something went wrong'

  logger.error(error)

  res.status(status).send({
    ...error,
    message,
    status
  })
}

export default exceptionFilter
