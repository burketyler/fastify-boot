import { hookNameList } from "../models/hooks.model";

function isValidHookName(name: string): boolean {
  return hookNameList.some((hn) => hn === name);
}

function isValidHookFn(fn: Function): boolean {
  return fn !== undefined || typeof fn === "function";
}

export function isValidHook(name: string, fn: Function) {
  return isValidHookName(name) && isValidHookFn(fn);
}

export function validateHookName(name: string): void {
  if (!isValidHookName(name)) {
    throw new Error(
      `Invalid hook name: ${name}. Please check the Fastify documentation for a valid list of hooks.`
    );
  }
}

export function validateHookFn(fn: Function): void {
  if (!isValidHookFn(fn)) {
    throw new Error(`Hook function is undefined!`);
  }
}

export function validateHook(name: string, fn: Function): void {
  validateHookName(name);
  validateHookFn(fn);
}
