declare module "express-timeout-handler" {
  import { type Request, type Response, type NextFunction } from "express";

  interface Options {
    /**
     * Default timeout for all endpoints in milliseconds.
     * If omitted there is no default timeout on endpoints.
     */
    timeout: number;
    /**
     * Function to be called on a timeout, responsible for terminating the request.
     * If omitted the module will end the request with a default 503 error.
     * @param request - The HTTP request object
     * @param response - The HTTP response object
     * @param next - The next middleware function in the chain
     */
    onTimeout?: (request: Request, response: Response, next: NextFunction) => void;
    /**
     * Function to be called if an attempt to send a response happens after the timeout.
     * @param request - The HTTP request object
     * @param method - The name of the method that was called on the response object
     * @param args - The arguments passed to the method
     * @param requestTime - The duration of the request at the time the timeout happened
     */
    onDelayedResponse?: (request: Request, method: string, args: unknown[], requestTime: number) => void;
    /**
     * List of response methods to be disabled when a timeout and error have occurred.
     * If omitted, a default list of all methods that tries to send a response will be disabled on the response object.
     */
    disable?: string[];
  }

  declare function handler(options: Options): e.Handler;
}
