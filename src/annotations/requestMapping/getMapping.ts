import { RequestMapping } from "./requestMapping";
import { ImplicitRequestOptions } from "../../models/controller.model";

export function GetMapping(url: string, options?: ImplicitRequestOptions) {
  return RequestMapping({ ...options, url, method: "GET" });
}
