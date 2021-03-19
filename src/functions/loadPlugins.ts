import { FastifyInstance } from "fastify";
import { useDebugger } from "ts-injection";
import { PluginObject } from "../models/plugins.model";

const { logger } = useDebugger("Plugins");

export function loadPlugins(
  fastify: FastifyInstance,
  pluginFile: { [key: string]: PluginObject }
): void {
  Object.entries(pluginFile).forEach(([name, fileExport]) => {
    if (isPlugin(fileExport)) {
      logger.debug(`Registering plugin ${name}.`);
      fastify.register(fileExport.plugin, fileExport.opts);
    }
  });
}

function isPlugin(plugin: PluginObject): plugin is PluginObject {
  return plugin.plugin !== undefined;
}
