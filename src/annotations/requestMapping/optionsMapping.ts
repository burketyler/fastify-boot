import { ImplicitRequestOptions } from "../../models/controller.model";
import { RequestMapping } from "./requestMapping";

export function OptionsMapping(url: string, options?: ImplicitRequestOptions) {
  return RequestMapping({ ...options, url, method: "OPTIONS" });
}
