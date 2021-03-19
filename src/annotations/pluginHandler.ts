import "reflect-metadata";
import { META_PLUGIN_OPTS, PluginList } from "../models/metaData.model";
import { FastifyPluginOptions } from "fastify";

export function PluginHandler(options?: FastifyPluginOptions) {
  return function (classCtor: any, member: string) {
    const hookFn = classCtor[member];
    Reflect.defineMetadata(META_PLUGIN_OPTS, options, hookFn);
    addToClassPluginList(classCtor, member);
  };
}

function addToClassPluginList(classCtor: any, member: string): void {
  classCtor[PluginList] = classCtor[PluginList] || [];
  classCtor[PluginList].push(member);
}
