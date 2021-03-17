import "reflect-metadata";
import { Hook } from "./hook";

export function OnError() {
  return Hook("onError");
}
