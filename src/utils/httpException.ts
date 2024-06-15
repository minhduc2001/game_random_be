class HttpException extends Error {
  public success: boolean
  public status: number
  public message: string
  public data: any

  constructor(status: number, message: string, data: any = null) {
    super(message)
    this.status = status
    this.message = message
    this.success = false
    this.data = data
  }
}

export default HttpException
