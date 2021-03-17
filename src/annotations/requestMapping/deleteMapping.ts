import { RequestMapping } from "./requestMapping";
import { ImplicitRequestOptions } from "../../models/controller.model";

export function DeleteMapping(url: string, options?: ImplicitRequestOptions) {
  return RequestMapping({ ...options, url, method: "DELETE" });
}
