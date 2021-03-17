import "reflect-metadata";
import { Hook } from "./hook";

export function PreSerialization() {
  return Hook("preSerialization");
}
