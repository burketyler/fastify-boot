import "reflect-metadata";
import { Autowire } from "ts-injection";
import { TOKEN_FASTIFY } from "../models/metaData.model";

export function FastifyServer() {
  return Autowire(TOKEN_FASTIFY);
}
