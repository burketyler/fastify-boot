import "reflect-metadata";
import { HookName, HookOptions } from "../../models/hooks.model";
import { HookList, META_HOOK_OPTS } from "../../models/metaData.model";

export function Hook(name: HookName) {
  return function (classCtor: any, member: string) {
    const hookFn = classCtor[member];
    Reflect.defineMetadata(
      META_HOOK_OPTS,
      {
        name,
      } as HookOptions,
      hookFn
    );
    addToClassHookList(classCtor, member);
  };
}

function addToClassHookList(classCtor: any, member: string) {
  classCtor[HookList] = classCtor[HookList] || [];
  classCtor[HookList].push(member);
}
