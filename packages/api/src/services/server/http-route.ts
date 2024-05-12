import { type IncomingMessage } from "http";

import { type IController } from "./http-controller";
import { BadRequestError } from "./utils/http-exceptions";

export type ResponseErrorType = {
  type: string;
  message: string;
};

export type PaginationType = {
  page: number;
  limit: number;
  total: number;
};

export interface IHttpResponse<T = unknown> {
  statusCode: number;
  data?: T | null;
  message?: string;
  pagination?: PaginationType;
  error?: ResponseErrorType;
}

export type HttpRequestType<Body = unknown, Params = unknown, Query = unknown> = Pick<
  IncomingMessage,
  "headers" | "method" | "url"
> & {
  body?: Body;
  params?: Params;
  query?: Query;
};

export type RequestMethods = "get" | "post" | "put" | "delete" | "patch";

export type Schema<T = unknown> = Pick<HttpRequestType<T, T, T>, "body" | "params" | "query">;

type HttpRoutePropsKeys<Body = unknown, Params = unknown, Query = unknown> = keyof HttpRequestType<Body, Params, Query>;

export type HttpResponseType<T = unknown> = {
  send: (data: IHttpResponse<T>) => void;
};

export interface IValidateResult<T> {
  isInvalid: boolean;
  message?: string;
  details: string;
  data?: T;
  key?: string;
}

export interface IDataValidator {
  validate: <T, S>(data: T, schema: S) => Promise<IValidateResult<T>>;
}

export type HttpRouteValidation<Schema = unknown> = {
  schema: Schema;
  validator: IDataValidator;
};

export type HttpRouteProps<Body = unknown, Params = unknown, Query = unknown, S = unknown> = {
  controller: IController<Body, Params, Query>;
  validation?: HttpRouteValidation<S>;
};

export class HttpRoute<Body = unknown, Params = unknown, Query = unknown, HttpRouteSchema = unknown> {
  path: string;
  method: RequestMethods;
  props: HttpRouteProps<Body, Params, Query, HttpRouteSchema>;

  constructor(path: string, method: RequestMethods, props: HttpRouteProps<Body, Params, Query, HttpRouteSchema>) {
    this.path = path;
    this.method = method;
    this.props = props;
  }

  parseQuery(url: URL): Record<string, string> {
    const query: Record<string, string> = {};

    url.searchParams.forEach((value, key) => {
      try {
        query[key] = JSON.parse(decodeURIComponent(value));
      } catch (error) {
        query[key] = value;
      }
    });

    return query;
  }

  parseParams(url: URL): Record<string, string> {
    const params: Record<string, string> = {};

    const routePathParts = this.path.split("/").filter(part => part);

    const requestPathParts = url.pathname.split("/").filter(part => part);

    // eslint-disable-next-line no-magic-numbers
    const firstPathPart = routePathParts.slice(0, 1).shift();

    if (firstPathPart) {
      const urlPath = url.pathname.substring(url.pathname.indexOf(firstPathPart));

      const firstUrlPart = requestPathParts.findIndex(value => value === firstPathPart);

      if (firstUrlPart) {
        const urlPathParts = urlPath.split("/");

        routePathParts.forEach((part, index) => {
          const value = urlPathParts[index];

          if (part.startsWith(":") && value) {
            try {
              const key = part.replace(":", "");

              params[key] = JSON.parse(value);
            } catch (error) {
              params[part] = value;
            }
          }
        });
      }
    }

    return params;
  }

  parseHeaders(headers: Headers): Record<string, string> {
    const parsedHeaders: Record<string, string> = {};

    headers.forEach((value, key) => {
      parsedHeaders[key] = value;
    });

    return parsedHeaders;
  }

  async validate(request: HttpRequestType<Body, Params, Query>) {
    if (!this.props?.validation) return;

    const entries = Object.entries(this.props.validation.schema as object);

    for (const [key, schema] of entries) {
      const requestData = request[key as HttpRoutePropsKeys];

      const { isInvalid, details, data } = await this.props.validation.validator.validate(requestData, schema);

      if (isInvalid || !data) {
        throw new BadRequestError("Falha na validação dos dados", new Error(details));
      }
    }
  }

  async handle(request: HttpRequestType<Body, Params, Query>, response: HttpResponseType): Promise<void> {
    await this.validate(request);

    const result = await this.props.controller.handler({
      body: request.body as Body,
      params: request.params as Params,
      query: request.query as Query,
      headers: request.headers,
    });

    response.send(result);
  }
}
