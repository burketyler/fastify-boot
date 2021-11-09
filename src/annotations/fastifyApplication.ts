import "reflect-metadata";
import { FastifyInstance } from "fastify";
import { processControllers } from "../functions/processControllers";
import { processGlobalHookContainers } from "../functions/processGlobalHookContainers";
import { processPluginContainers } from "../functions/processPluginContainers";
import {
  makeClassInjectable,
  Newable,
  useDebugger,
  useInjectionContext,
} from "ts-injection";
import { TOKEN_FASTIFY } from "../models/metaData.model";

const { injectionCtx } = useInjectionContext();

export function FastifyApplication<T extends Newable>(classCtor: T) {
  const { logger } = useDebugger("Bootstrap");
  logger.debug(`Detected Fastify Application: ${classCtor.name}.`);
  const fastify: FastifyInstance = injectionCtx.retrieveByToken(TOKEN_FASTIFY);
  makeClassInjectable(classCtor);
  processControllers(fastify);
  processGlobalHookContainers(fastify);
  processPluginContainers(fastify);
}
