import "reflect-metadata";
import { FastifyInstance } from "fastify";
import { getMetaList } from "./getMetaList";
import { validateHook } from "./validateHook";
import { useDebugger, useInjectionContext } from "ts-injection";
import { HookList, META_HOOK_OPTS } from "../models/metaData.model";
import { HookOptions } from "../models/hooks.model";
import { InjectableType } from "../models/injectableType.model";

const { injectionCtx } = useInjectionContext();
const { logger } = useDebugger("Hooks");

export function processGlobalHookContainers(fastify: FastifyInstance): void {
  logger.debug("Processing global hook containers.");
  injectionCtx.queryByType(InjectableType.HOOK_CONT).forEach((hookClass) => {
    const methodNameList = getMetaList(hookClass as never, HookList as never);
    methodNameList
      .map((methodName: string) => hookClass[methodName])
      .forEach((hookFn) => {
        addHook(fastify, hookClass as never, hookFn);
      });
  });
}

function addHook(
  fastify: FastifyInstance,
  hookClass: never,
  hookFn: () => never
) {
  const hookOpts: HookOptions = Reflect.getMetadata(META_HOOK_OPTS, hookFn);
  validateHook(hookOpts.name, hookFn);
  logger.debug(`Applying global hook to ${hookOpts.name}: ${hookFn}.`);
  fastify.addHook(hookOpts.name as never, hookFn.bind(hookClass));
}
