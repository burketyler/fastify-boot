import "reflect-metadata";
import { Hook } from "./hook";

export function PreValidation() {
  return Hook("preValidation");
}
