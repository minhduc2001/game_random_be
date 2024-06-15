import HttpException from '@/utils/httpException'

class NotFound extends HttpException {
  constructor(error?: { message?: string; data?: any }) {
    super(200, error?.message ?? 'Not Found', error?.data)
  }
}

export default NotFound
