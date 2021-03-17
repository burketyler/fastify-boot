import { FastifyInstance } from "fastify";
import { useDebugger } from "ts-injection";
import { RegisterArguments } from "../models/plugins";

const { logger } = useDebugger("Plugins");

export function loadPlugins(
  fastify: FastifyInstance,
  pluginFile: { [key: string]: RegisterArguments }
): void {
  Object.entries(pluginFile).forEach(([name, plugin]) => {
    if (isPlugin(plugin)) {
      logger.debug(`Registering plugin ${name}.`);
      fastify.register(plugin.plugin, plugin.opts);
    }
  });
}

function isPlugin(plugin: RegisterArguments): plugin is RegisterArguments {
  return plugin.plugin !== undefined;
}
