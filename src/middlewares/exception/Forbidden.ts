import HttpException from '@/utils/httpException'

class Forbidden extends HttpException {
  constructor(error?: { message?: string; data?: any }) {
    super(401, error?.message ?? 'You don’t have permission to access from this server', error?.data)
  }
}

export default Forbidden
