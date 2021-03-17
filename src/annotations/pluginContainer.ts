import "reflect-metadata";
import {
  makeClassInjectable,
  META_TYPE,
  useDebugger,
  useInjectionContext,
} from "ts-injection";
import { InjectableType } from "../models/injectableType.model";

const { injectionCtx } = useInjectionContext();
const { logger } = useDebugger("Plugins");

export function PluginContainer<T extends { new (...args: any[]): {} }>(
  classCtor: T
) {
  logger.debug(`Detected plugin container: ${classCtor.name}.`);
  const token = makeClassInjectable(classCtor);
  injectionCtx.addMetadataToItem(token, {
    [META_TYPE]: InjectableType.PLUGIN_CONT,
  });
}
