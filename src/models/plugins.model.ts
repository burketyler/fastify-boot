import { FastifyInstance } from "fastify";

export type PluginFunction<OptionsType> = (
  fastify: FastifyInstance,
  opts: OptionsType,
  done: () => void
) => void;

export interface PluginObject<OptionsType> {
  plugin: PluginFunction<OptionsType>;
  opts: OptionsType;
}
