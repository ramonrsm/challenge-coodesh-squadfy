import { HttpStatusCode } from "./http-status";

export class HttpException extends Error {
  code: number;
  error?: Error;

  constructor(message?: string, code = HttpStatusCode.INTERNAL_SERVER_ERROR, error?: Error) {
    super(message || "Erro interno no servidor.");
    this.code = code;
    this.error = error;
  }
}

export class InternalServerError extends HttpException {
  static code = HttpStatusCode.INTERNAL_SERVER_ERROR;

  constructor(message = "Erro interno no servidor.", stack?: string) {
    super(message, InternalServerError.code);
    this.name = "InternalServer";
    this.stack = stack;
  }
}

export class BadRequestError extends HttpException {
  static code = HttpStatusCode.BAD_REQUEST;

  constructor(message: string, error?: Error) {
    super(message, BadRequestError.code, error);
    this.name = "BadRequestError";
  }
}

export class NotFoundError extends HttpException {
  static code = HttpStatusCode.NOT_FOUND;

  constructor(message: string, error?: Error) {
    super(message, NotFoundError.code, error);
    this.name = "NotFoundError";
  }
}

export class ForbiddenError extends HttpException {
  static code = HttpStatusCode.FORBIDDEN;
  redirect?: string;

  constructor(message?: string, redirect?: string) {
    super(message || "Não autorizado.", ForbiddenError.code);
    this.name = "ForbiddenError";
    this.redirect = redirect;
  }
}

export class UnauthorizedError extends HttpException {
  static code = HttpStatusCode.UNAUTHORIZED;

  constructor(message?: string) {
    super(message || "Não autorizado.", UnauthorizedError.code);
    this.name = "Unauthorized";
  }
}

export class ConflictError extends HttpException {
  static code = HttpStatusCode.CONFLICT;

  constructor(message?: string) {
    super(message || "Conflito", ConflictError.code);
    this.name = "Conflict";
  }
}

export class PreconditionFailedError extends HttpException {
  static code = HttpStatusCode.PRECONDITION_FAILED;

  constructor(message?: string) {
    super(message || "Não autorizado.", PreconditionFailedError.code);
    this.name = "PreconditionFailed";
  }
}

export class ServiceUnavailable extends HttpException {
  static code = HttpStatusCode.SERVICE_UNAVAILABLE;

  constructor(message?: string) {
    super(message || "Serviço indisponível", ServiceUnavailable.code);
    this.name = "Service Unavailable";
  }
}

export class TooManyRequestError extends HttpException {
  static code = HttpStatusCode.TOO_MANY_REQUESTS;

  constructor(message?: string) {
    super(message || "Too Many Requests", TooManyRequestError.code);
    this.name = "TooManyRequestError";
  }
}

export class NotImplemented extends HttpException {
  static code = HttpStatusCode.NOT_IMPLEMENTED;

  constructor(message?: string) {
    super(message || "Not Implemented", NotImplemented.code);
    this.name = "NotImplemented";
  }
}

export class GoneError extends HttpException {
  static code = HttpStatusCode.GONE;

  constructor(message: string) {
    super(message, GoneError.code);
    this.name = "Gone";
  }
}

export class UnavailableServiceError extends HttpException {
  static code = HttpStatusCode.SERVICE_UNAVAILABLE;

  constructor(message: string) {
    super(message, UnavailableServiceError.code);
    this.name = "UnavailableService";
  }
}
