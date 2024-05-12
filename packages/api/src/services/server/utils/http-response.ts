import { type PaginationType, type ResponseErrorType } from "../http-route";
import { HttpException, InternalServerError } from "./http-exceptions";

export interface IHttpResponse<T = unknown> {
  statusCode: number;
  data?: T | null;
  message?: string;
  pagination?: PaginationType;
  error?: ResponseErrorType;
  headers?: Record<string, string>;
}

export class HttpResponse {
  static error(error: Error): IHttpResponse {
    const httpResponse: IHttpResponse = {
      statusCode: InternalServerError.code,
      message: "Erro interno no servidor.",
      error: {
        type: InternalServerError.name,
        message: error.message,
      },
    };

    if (httpResponse.error) {
      httpResponse.message = error.message;
      httpResponse.error.type = error.name;

      if (error instanceof HttpException) {
        httpResponse.statusCode = error.code;
        httpResponse.error.message = error.error?.message || error.message;
      }
    }

    if (process.env.NODE_ENV !== "development" && error instanceof InternalServerError) {
      httpResponse.error!.message = "Contate o administrador do sistema.";
    }

    return httpResponse;
  }
}
