import "reflect-metadata";
import { Hook } from "./hook";

export function PreParsing() {
  return Hook("preParsing");
}
