import {
  FastifyHttp2Options,
  FastifyHttp2SecureOptions,
  FastifyHttpsOptions,
  FastifyInstance,
  FastifyServerOptions,
} from "fastify";

export type PluginFunction = (
  fastify: FastifyInstance,
  opts: any,
  done: () => void
) => void;

export interface RegisterArguments {
  plugin: PluginFunction;
  opts: any;
}

export type FastifyOptions =
  | FastifyHttp2SecureOptions<any, any>
  | FastifyHttp2Options<any, any>
  | FastifyHttpsOptions<any, any>
  | FastifyServerOptions<any, any>;
