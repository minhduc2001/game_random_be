import { response } from 'express'

response.customSuccess = function (status, data: any, message: string = 'Success') {
  return this.status(status).json({
    success: true,
    status,
    message,
    data
  })
}
