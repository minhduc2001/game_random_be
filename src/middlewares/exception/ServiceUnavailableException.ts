import HttpException from '@/utils/httpException'

class ServiceUnavailableException extends HttpException {
  constructor() {
    super(500, 'ServiceUnavailableException')
  }
}

export default ServiceUnavailableException
