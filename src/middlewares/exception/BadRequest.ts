import HttpException from '@/utils/httpException'

class BadRequest extends HttpException {
  constructor(error: { message: string; data?: any }) {
    super(200, error.message, error.data)
  }
}

export default BadRequest
