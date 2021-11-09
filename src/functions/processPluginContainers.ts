import "reflect-metadata";
import { FastifyInstance } from "fastify";
import { getMetaList } from "./getMetaList";
import { useDebugger, useInjectionContext } from "ts-injection";
import { META_PLUGIN_OPTS, PluginList } from "../models/metaData.model";
import { InjectableType } from "../models/injectableType.model";

const { injectionCtx } = useInjectionContext();
const { logger } = useDebugger("Plugins");

export function processPluginContainers(fastify: FastifyInstance): void {
  logger.debug("Processing plugin containers.");
  injectionCtx
    .queryByType(InjectableType.PLUGIN_CONT)
    .forEach((pluginClass) => {
      const methodNameList = getMetaList(
        pluginClass as never,
        PluginList as never
      );
      methodNameList
        .map((methodName: string) => {
          return { pluginFn: pluginClass[methodName], methodName: methodName };
        })
        .forEach(({ pluginFn, methodName }) => {
          registerPlugin(fastify, methodName, pluginClass as never, pluginFn);
        });
    });
}

function registerPlugin(
  fastify: FastifyInstance,
  methodName: string,
  pluginClass: never,
  pluginFn: () => never
) {
  const pluginOpts = Reflect.getMetadata(META_PLUGIN_OPTS, pluginFn);
  logger.debug(`Registering plugin: ${methodName}.`);
  fastify.register(pluginFn.bind(pluginClass), pluginOpts);
}
