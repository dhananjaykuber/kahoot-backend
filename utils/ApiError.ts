class ApiError extends Error {
  public statusCode: number;
  public status: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${
      statusCode.toString().startsWith('4') ? 'fail' : 'success'
    }`;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
