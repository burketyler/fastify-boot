import { FastifyInstance } from "fastify";
import { useDebugger } from "ts-injection";
import { isValidHook } from "./validateHook";

const { logger } = useDebugger("Hooks");

export function loadGlobalHooks(
  fastify: FastifyInstance,
  hookFile: { [key: string]: () => never }
): void {
  Object.entries(hookFile).forEach(([name, fn]) => {
    if (isValidHook(name, fn)) {
      logger.debug(`Applying global function hook to ${name}: ${fn}.`);
      fastify.addHook(name as never, fn as never);
    }
  });
}
