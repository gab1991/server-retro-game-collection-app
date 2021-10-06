export class AppError extends Error {
  statusCode: number;

  status: 'fail' | 'error';

  constructor(message: string, statusCode: number, public additionals?: unknown) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}
