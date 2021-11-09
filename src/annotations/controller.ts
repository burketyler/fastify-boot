import "reflect-metadata";
import {
  makeClassInjectable,
  META_TYPE,
  useDebugger,
  useInjectionContext,
} from "ts-injection";
import { META_CTRL_OPTS } from "../models/metaData.model";
import { InjectableType } from "../models/injectableType.model";

const { injectionCtx } = useInjectionContext();
const { logger } = useDebugger("Controllers");

export function Controller<T extends { new (...args: never[]): never }>(
  basePath = "/"
) {
  return (classCtor: T) => {
    logger.debug(`Detected controller: ${classCtor.name}.`);
    const token = makeClassInjectable(classCtor);
    basePath = formatBasePath(basePath);
    injectionCtx.addMetadataToItem(token, {
      [META_TYPE]: InjectableType.CONTROLLER,
      [META_CTRL_OPTS]: { basePath },
    });
  };
}

function formatBasePath(basePath: string): string {
  const firstChar = basePath.charAt(0);
  if (firstChar !== "*" && firstChar !== "/") {
    return `/${basePath}`;
  }
  return basePath;
}
