import { FastifyInstance, RouteOptions } from "fastify";
import path from "path";
import { validateHook } from "./validateHook";
import { getMetaList } from "./getMetaList";
import { useDebugger, useInjectionContext } from "ts-injection";
import { ControllerOptions, RouteHandler } from "../models/controller.model";
import {
  HookList,
  META_CTRL_OPTS,
  META_HOOK_OPTS,
  META_ROUTE_OPTS,
  RouteList,
} from "../models/metaData.model";
import { HookOptions } from "../models/hooks.model";
import { InjectableType } from "../models/injectableType.model";

const { injectionCtx } = useInjectionContext();
const { logger } = useDebugger("Controllers");

export function processControllers(fastify: FastifyInstance): void {
  logger.debug("Processing controllers.");
  injectionCtx.queryByType(InjectableType.CONTROLLER).forEach((ctrl) => {
    processRoutes({
      fastify,
      ctrl,
      routes: getMetaList(ctrl, RouteList),
      ctrlOpts: getControllerOpts(ctrl),
      ctrlHooks: getMetaList(ctrl, HookList),
    });
  });
}

function getControllerOpts(ctrl: any): ControllerOptions {
  return Reflect.getMetadata(META_CTRL_OPTS, ctrl);
}

function processRoutes(inputs: {
  fastify: FastifyInstance;
  ctrl: any;
  routes: string[];
  ctrlOpts: ControllerOptions;
  ctrlHooks: string[];
}): void {
  inputs.routes.forEach((route) => {
    addRoute({
      fastify: inputs.fastify,
      ctrl: inputs.ctrl,
      route,
      ctrlOpts: inputs.ctrlOpts,
      ctrlHooks: inputs.ctrlHooks,
    });
  });
}

function addRoute(inputs: {
  fastify: FastifyInstance;
  ctrl: any;
  route: string;
  ctrlOpts: ControllerOptions;
  ctrlHooks: string[];
}): void {
  const handler: RouteHandler = inputs.ctrl[inputs.route];
  const routeOpts = getRouteOpts(handler);
  routeOpts.url = path.join(inputs.ctrlOpts.basePath, routeOpts.url);
  const enrichedOpts = enrichRouteOpts({
    ctrl: inputs.ctrl,
    options: routeOpts,
    handler: (...args) => handler.call(inputs.ctrl, ...args),
    ctrlHooks: inputs.ctrlHooks.map((methodName) => inputs.ctrl[methodName]),
  });
  inputs.fastify.route(enrichedOpts);
}

function getRouteOpts(route: RouteHandler): RouteOptions {
  return Reflect.getMetadata(META_ROUTE_OPTS, route);
}

function enrichRouteOpts(inputs: {
  ctrl: any;
  options: RouteOptions;
  handler: RouteHandler;
  ctrlHooks: Function[];
}): RouteOptions {
  const { logger } = useDebugger("Controllers");
  logger.debug(`Adding route: ${inputs.options.method} ${inputs.options.url}.`);
  let enrichedOpts = addHandlerToOptions(
    inputs.ctrl,
    inputs.handler,
    inputs.options
  );
  enrichedOpts = addAllHooksToOptions(
    inputs.ctrl,
    inputs.ctrlHooks,
    enrichedOpts
  );
  return enrichedOpts;
}

function addHandlerToOptions(
  ctrl: any,
  handler: RouteHandler,
  options: RouteOptions
): RouteOptions {
  return {
    ...options,
    handler: handler.bind(ctrl),
  };
}

function addAllHooksToOptions(
  ctrl: any,
  ctrlHooks: Function[],
  options: RouteOptions
): RouteOptions {
  let enrichedOptions = { ...options };
  for (let hook of ctrlHooks) {
    enrichedOptions = addHookToOptionsIfDoesntExist(ctrl, hook, options);
  }
  return enrichedOptions;
}

function addHookToOptionsIfDoesntExist(
  ctrl: any,
  hookFn: Function,
  options: RouteOptions
): RouteOptions {
  const { logger } = useDebugger("Controllers");
  const enrichedOpts = { ...options };
  const hookOpts: HookOptions = Reflect.getMetadata(META_HOOK_OPTS, hookFn);
  validateHook(hookOpts.name, hookFn);
  const existingHook = (enrichedOpts as any)[hookOpts.name];
  if (!existingHook) {
    logger.debug(`Applying controller hook: ${hookOpts.name} ${hookFn}.`);
    (enrichedOpts as any)[hookOpts.name] = hookFn.bind(ctrl);
  } else {
    logger.debug(
      `Detected route hook: ${hookOpts.name}, don't apply controller hook.`
    );
  }
  return enrichedOpts;
}
