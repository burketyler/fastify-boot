const Fastify = require("fastify");
const Boot = require("fastify-boot");

const { logger } = Boot.useDebugger("Bootstrap");

bootstrap();
require("../index");

function bootstrap() {
  const fastify = createInstance();
  Boot.register(fastify, Boot.TOKEN_FASTIFY);
  bootstrapInstance(fastify);
}

function createInstance() {
  logger.debug("Creating Fastify instance.");
  return Fastify(parseOptionsFile());
}

function parseOptionsFile() {
  const configFile = require("../fastify.config");
  if (configFile) {
    logger.debug("Fastify config loaded successfully.");
    return configFile.default;
  } else {
    logger.debug("No config file detected.");
  }
}

function bootstrapInstance(fastify) {
  logger.debug("Bootstrapping Fastify instance.");
  loadControllers();
  processSchemas(fastify);
  processHooks(fastify);
  processPlugins(fastify);
}

function loadControllers() {
  requireFilesByContext(require.context("../", true, /\.controller\./));
}

function processSchemas(fastify) {
  const schemas = requireFilesByContext(
    require.context("../", true, /\.schema\./)
  );
  Object.values(schemas).forEach((file) => {
    Boot.loadSharedSchemas(fastify, file);
  });
}

function processHooks(fastify) {
  const hooks = requireFilesByContext(require.context("../", true, /\.hook\./));
  Object.values(hooks).forEach((file) => {
    Boot.loadGlobalHooks(fastify, file);
  });
}

function processPlugins(fastify) {
  const plugins = requireFilesByContext(
    require.context("../", true, /\.plugin\./)
  );
  Object.values(plugins).forEach((file) => {
    Boot.loadPlugins(fastify, file);
  });
}

function requireFilesByContext(context) {
  const cache = {};
  context.keys().forEach((key) => {
    cache[key] = context(key);
  });
  return cache;
}
