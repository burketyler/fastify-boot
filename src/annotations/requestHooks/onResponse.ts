import "reflect-metadata";
import { Hook } from "./hook";

export function OnResponse() {
  return Hook("onResponse");
}
