import { ImplicitRequestOptions } from "../../models/controller.model";
import { RequestMapping } from "./requestMapping";

export function PostMapping(url: string, options?: ImplicitRequestOptions) {
  return RequestMapping({ ...options, url, method: "POST" });
}
