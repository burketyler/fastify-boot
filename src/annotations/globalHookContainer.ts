import "reflect-metadata";
import {
  makeClassInjectable,
  META_TYPE,
  Newable,
  useDebugger,
  useInjectionContext,
} from "ts-injection";
import { InjectableType } from "../models/injectableType.model";

const { injectionCtx } = useInjectionContext();
const { logger } = useDebugger("Hooks");

export function GlobalHookContainer<T extends Newable>(classCtor: T) {
  logger.debug(`Detected global hook container: ${classCtor.name}.`);
  const token = makeClassInjectable(classCtor);
  injectionCtx.addMetadataToItem(token, {
    [META_TYPE]: InjectableType.HOOK_CONT,
  });
}
