import { FastifyInstance } from "fastify";

export type PluginFunction = (
  fastify: FastifyInstance,
  opts: any,
  done: () => void
) => void;

export interface PluginObject {
  plugin: PluginFunction;
  opts: any;
}
