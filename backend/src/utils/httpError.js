// Ошибка с кодом HTTP: throw new HttpError(409, "mensaje")
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
