/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FastifyHttp2Options,
  FastifyHttp2SecureOptions,
  FastifyHttpsOptions,
  FastifyServerOptions,
} from "fastify";

export type FastifyOptions =
  | FastifyHttp2SecureOptions<any, any>
  | FastifyHttp2Options<any, any>
  | FastifyHttpsOptions<any, any>
  | FastifyServerOptions<any, any>;
