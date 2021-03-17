import "reflect-metadata";
import { Hook } from "./hook";

export function OnSend() {
  return Hook("onSend");
}
