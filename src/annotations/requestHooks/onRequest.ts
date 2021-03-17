import "reflect-metadata";
import { Hook } from "./hook";

export function OnRequest() {
  return Hook("onRequest");
}
