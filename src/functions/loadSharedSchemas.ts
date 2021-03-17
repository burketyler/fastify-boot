import { FastifyInstance } from "fastify";
import { useDebugger } from "ts-injection";

const { logger } = useDebugger("Schemas");

interface Schema {
  type: string;
}

export function loadSharedSchemas(
  fastify: FastifyInstance,
  schemaFile: { [key: string]: Schema }
): void {
  Object.entries(schemaFile).forEach((entry) => {
    if (isSchema(entry[1])) {
      logger.debug(`Loading schema ${entry[0]}.`);
      fastify.addSchema(entry[1]);
    }
  });
}

function isSchema(schema: Schema): schema is Schema {
  return schema.type !== undefined && typeof schema.type === "string";
}
