import { type IncomingHttpHeaders } from "http";
import { type HttpRequestType, type IHttpResponse } from "./http-route";

export type RequestHandlerType<Body, Params, Query> = (
  request: HttpRequestType<Body, Params, Query>
) => Promise<IHttpResponse>;

export type HandlerProps<Body = unknown, Params = unknown, Query = unknown> = {
  body: Body;
  params: Params;
  query: Query;
  headers: IncomingHttpHeaders;
};

export interface IController<Body = unknown, Params = unknown, Query = unknown, OutputData = unknown> {
  handler: (props: HandlerProps<Body, Params, Query>) => Promise<IHttpResponse<OutputData>>;
}
