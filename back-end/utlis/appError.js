export class appError extends Error {
 constructor(statusCode, requestStatus, errorMessage) {
    super()
  this.statusCode = statusCode;
  this.requestStatus = requestStatus;
  this.message = errorMessage;
 }
}
