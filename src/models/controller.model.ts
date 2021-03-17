import { RouteHandlerMethod, RouteOptions } from "fastify";

export interface ControllerOptions {
  basePath?: string;
}

export type RequestOptions = Omit<RouteOptions, "handler">;
export type ImplicitRequestOptions = Omit<RequestOptions, "url" | "method">;
export type RouteHandler = OmitThisParameter<RouteHandlerMethod>;
