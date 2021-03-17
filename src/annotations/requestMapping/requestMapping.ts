import { META_ROUTE_OPTS, RouteList } from "../../models/metaData.model";
import { RequestOptions } from "../../models/controller.model";

export function RequestMapping(options: RequestOptions) {
  return function (classCtor: any, member: string) {
    const handler = classCtor[member];
    validateHandler(handler, options);
    Reflect.defineMetadata(META_ROUTE_OPTS, options, handler);
    addRouteToClassMethodList(classCtor, member);
  };
}

function addRouteToClassMethodList(classCtor: any, member: string) {
  classCtor[RouteList] = classCtor[RouteList] || [];
  classCtor[RouteList].push(member);
}

function validateHandler(
  handler: RequestOptions,
  options: RequestOptions
): void {
  if (handler === undefined) {
    throw new Error(`${options.method} ${options.url} - Handler is undefined!`);
  }
}
