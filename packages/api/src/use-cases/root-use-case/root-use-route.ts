import {
  HttpRoute,
  type Schema,
  type RequestMethods,
  type HttpRouteValidation,
  type HttpRouteProps,
} from "@services/server/http-route";

export class RootRoute<Body = unknown, Params = unknown, Query = unknown> extends HttpRoute<
  Body,
  Params,
  Query,
  Schema
> {
  static path = "/";
  static method: RequestMethods = "get";
  validation?: HttpRouteValidation<Schema>;

  constructor(props: HttpRouteProps<Body, Params, Query, Schema>) {
    super(RootRoute.path, RootRoute.method, props);
    this.validation = props.validation;
  }
}
