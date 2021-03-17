import "reflect-metadata";
import { Hook } from "./hook";

export function OnTimeout() {
  return Hook("onTimeout");
}
