import { Request, Response, NextFunction } from 'express'

export function extendedResponse(req: Request, res: Response, next: NextFunction) {
  res.customSuccess = function (status, data: any, message: string = 'Success') {
    return this.status(status).json({
      success: true,
      status,
      message,
      data
    })
  }
  next()
}
