import HttpException from '@/utils/httpException'

class Authorization extends HttpException {
  constructor(error?: { message?: string; data?: any }) {
    super(403, error?.message ?? 'Authorization Required', error?.data)
  }
}

export default Authorization
