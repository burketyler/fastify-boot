import "reflect-metadata";
import { Hook } from "./hook";

export function PreHandler() {
  return Hook("preHandler");
}
