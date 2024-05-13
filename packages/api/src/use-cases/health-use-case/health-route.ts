import {
  HttpRoute,
  type Schema,
  type RequestMethods,
  type HttpRouteValidation,
  type HttpRouteProps,
} from "@services/server/http-route";

export class HealthRoute<Body = unknown, Params = unknown, Query = unknown> extends HttpRoute<
  Body,
  Params,
  Query,
  Schema
> {
  static path = "/";
  static method: RequestMethods = "get";
  validation?: HttpRouteValidation<Schema>;

  constructor(props: HttpRouteProps<Body, Params, Query, Schema>) {
    super(HealthRoute.path, HealthRoute.method, props);
    this.validation = props.validation;
  }
}
