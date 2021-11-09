import { FastifyInstance } from "fastify";

export type PluginFunction = (
  fastify: FastifyInstance,
  opts: never,
  done: () => void
) => void;

export interface PluginObject {
  plugin: PluginFunction;
  opts: never;
}
