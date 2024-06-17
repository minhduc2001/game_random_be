declare namespace Express {
  export interface Response {
    customSuccess(status: number, data?: any, message?: string): void
  }
}
