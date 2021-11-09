import "reflect-metadata";
import { META_PLUGIN_OPTS, PluginList } from "../models/metaData.model";
import { FastifyPluginOptions } from "fastify";

export function PluginHandler(options?: FastifyPluginOptions) {
  return function (classCtor: never, member: string) {
    const hookFn = classCtor[member];
    Reflect.defineMetadata(META_PLUGIN_OPTS, options, hookFn);
    addToClassPluginList(classCtor, member);
  };
}

function addToClassPluginList(classCtor: never, member: string): void {
  classCtor[PluginList] = classCtor[PluginList] || [];
  (classCtor[PluginList] as string[]).push(member);
}
