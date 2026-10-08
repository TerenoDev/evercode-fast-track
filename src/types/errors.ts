export class ExternalApiError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 502) {
    super(message);
    this.name = 'ExternalApiError';
    this.statusCode = statusCode;
  }
}