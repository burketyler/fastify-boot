# fastify-boot
Extending the [ts-injection](https://github.com/burketyler/ts-injection) library,
`fastify-boot` is a Spring Boot inspired opinionated view on building and
bootstrapping a [Fastify](https://www.fastify.io/) web application. The goal of this project
is to create a framework for developers to rapidly start feature rich new projects and abstract away the
repetitive tasks like plumbing and configuration, so they can focus on the important things.

Some key features include:

- Dependency injection.
- Intuitive annotation based declaration of Fastify components.
- Automatic resolution and bootstrapping of controllers, hooks and plugins.
- Built in and configurable environment variable injection.
- Built in code bundling with Webpack.
- Built in Typescript support.
- Built in Jest support.

# Table of Contents

<!--ts-->
   * [Setup](#setup)
      * [Install](#install)
   * [Getting started](#getting-started)
      * [Scripts](#scripts)
      * [Application](#application)
         * [@FastifyApplication  (Class only)](#fastifyapplication--class-only)
         * [@FastifyServer()  (Class member only)](#fastifyserver--class-member-only)
      * [Controllers](#controllers)
         * [@Controller(basePath?: string)](#controllerbasepath-string)
         * [@RequestMapping(options: RequestOptions)](#requestmappingoptions-requestoptions)
            * [Implicit routes](#implicit-routes)
      * [Hooks](#hooks)
         * [Global Hook Containers](#global-hook-containers)
            * [@GlobalHookContainer](#globalhookcontainer)
            * [@Hook(hookName: string)](#hookhookname-string)
               * [Implicit hooks](#implicit-hooks)
         * [Global Hook Functions](#global-hook-functions)
            * [Example](#example)
            * [Supported hooks](#supported-hooks)
      * [Plugins](#plugins)
         * [Plugin Containers](#plugin-containers)
            * [@PluginContainer](#plugincontainer)
            * [@PluginHandler(options?: FastifyPluginOptions)](#pluginhandleroptions-fastifypluginoptions)
         * [Plugin Objects](#plugin-objects)
            * [Example](#example-1)

<!-- Added by: tburke, at: Fri Mar 19 16:08:31 AEDT 2021 -->

<!--te-->

# Setup

## Install

The recommended way to create a `fastify-boot` app is with
[create-fastify-boot](https://github.com/burketyler/create-fastify-boot). Based on the same concept
as `create-react-app`, it will initialize a new `fastify-boot` project with all the dependencies and scaffolding
required to get started.

```shell
$ npx create-fastify-boot {appName}
```

or

```shell
$ npm install -G create-fastify-boot
$ create-fastify-boot {appName}
```

# Getting started
## CLI
- `fastify-boot build`: Compile your code with Webpack into a single bundle file.
- `fastify-boot start`: Run Jest in interactive mode.
- `fastify-boot test`: Start your Fastify server.

## Application

```typescript
@FastifyApplication
export class App {
    @FastifyServer()
    private server: FastifyInstance;

    constructor() {
    }

    public start(): void {
        this.server.listen(8080, "0.0.0.0", (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
}
```

### @FastifyApplication

Apply this annotation to the main entry class of your application only. It starts bootstrapping your Fastify instance.

### @FastifyServer()

Injects the Fastify server instance into a class member for consumption.

## Controllers

A controller in `fastify-boot` is a class definition marked with the `@Controller`
annotation. The file that contains the class must follow the naming convention `${name}.controller.ts`
to facilitate automatic resolution. Routes can be defined in a controller class by marking methods with
the `@RequestMapping` annotation (or the relevant implicit mapping). Controller specific hooks can also be applied using
the `@Hook` annotation (or the relevant implicit mapping).

```typescript
// greeting.controller.ts

@Controller("/greet")
export class GreetingController {
    constructor(private service: Greeter) {
    }

    @RequestMapping({
        method: "GET",
        url: "/bonjour"
    })
    public async getBonjour(
        request: FastifyRequest,
        reply: FastifyReply
    ): Promise<void> {
        reply.status(200).send({greeting: this.service.sayBonjour()});
    }

    @GetMapping("/hello")
    public async getHello(
        request: FastifyRequest,
        reply: FastifyReply
    ): Promise<void> {
        reply.status(200).send({greeting: this.service.sayHello()});
    }

    @OnSend()
    public async addCorsHeaders(
        request: FastifyRequest,
        reply: FastifyReply,
        payload: any
    ): Promise<void> {
        // I will only apply to routes defined in GreetingController
        reply.headers({
            "Access-Control-Allow-Origin": "*",
        });
        return payload;
    }
}
```

The above code will result in two routes being created: `/greet/bonjour` and `/greet/hello`.

### @Controller(basePath?: string)

Indicates to the framework that methods within this class should be scanned for route handlers. An optional basePath can
be provided which prefixes the url of all routes defined in the controller.

### @RequestMapping(options: RequestOptions)

Define a generic route within a controller. You must supply the request options including things like method, url etc.
The options object is a Fastify `RouteOptions` interface, minus a handler field.

#### Implicit routes

You can define implicit route methods using:

- `@GetMapping(url: string, options?: ImplicitRequestOptions)`
- `@PostMapping(url: string, options?: ImplicitRequestOptions)`
- `@PutMapping(url: string, options?: ImplicitRequestOptions)`
- `@DeleteMapping(url: string, options?: ImplicitRequestOptions)`
- `@PatchMapping(url: string, options?: ImplicitRequestOptions)`
- `@HeadMapping(url: string, options?: ImplicitRequestOptions)`
- `@OptionsMapping(url: string, options?: ImplicitRequestOptions)`

## Hooks

### Global Hook Containers

Global hooks can be defined within the context of a class so that you have access to all the magic of `fastify-boot`
dependency injection. The classes are marked with the
`@GlobalHookContainer` annotation, and the file that contains the class must follow the naming
convention `${name}.hook.ts` to facilitate automatic resolution.

Hooks are defined in a global hook container by marking methods with the `@Hook` annotation
(or the relevant implicit mapping).

```typescript
// myHooks.hook.ts

@GlobalHookContainer
export class MyHooks {
    @Env("ALLOW_ORIGIN")
    private allowOrigin: string;

    constructor() {
    }

    @Hook("preHandler")
    public async doSomething(
        request: FastifyRequest,
        reply: FastifyReply
    ): Promise<void> {
        // Do something with request
        return payload;
    }

    @OnSend()
    public async addCorsHeaders(
        request: FastifyRequest,
        reply: FastifyReply,
        payload: any
    ): Promise<void> {
        reply.headers({
            "Access-Control-Allow-Origin": this.allowOrigin,
        });
        return payload;
    }
}
```

#### @GlobalHookContainer

Indicates to the framework that methods within this class should be scanned for global hook methods. These hooks will be
applied to every request on the server.

#### @Hook(hookName: string)

Define a generic hook method, provide the name of the hook the method should be applied to.

- When applied to a `@GlobalHookContainer` class, the hook is applied at the global level.
- When applied to a method within a `@Controller` class, the hook is applied only to routes within that controller.

##### Implicit hooks

- `@OnError`
- `@OnRequest`
- `@OnResponse`
- `@OnSend`
- `@OnTimeout`
- `@PreHandler`
- `@PreParsing`
- `@PreSerialization`
- `@PreValidation`

### Global Hook Functions

If your hook doesn't need access to a class context, you can also define hooks in a functional manner. You still need to
put the function inside a file following the hook name convention `${name}.hook.ts`. The function name should be the
name of the Fastify hook you want to add the method to.

#### Example

```typescript
// addCorsHeaders.hook.ts

export async function onSend(
    request: FastifyRequest,
    reply: FastifyReply,
    payload: any
): Promise<void> {
    reply.headers({
        "Access-Control-Allow-Origin": this.allowOrigin,
    });
    return payload;
}
```

#### Supported hooks

- onRequest
- preParsing
- preValidation
- preHandler
- preSerialization
- onError
- onSend
- onResponse
- onTimeout

## Plugins

### Plugin Containers

Plugins can be defined within the context of a class so that you have access to all the magic of `fastify-boot`
dependency injection. The classes are marked with the `@PluginContainer` annotation, and the file that contains the
class must follow the naming convention `${name}.plugin.ts` to facilitate automatic resolution.

Plugins are defined in a plugin container by marking methods with the `@PluginHandler` annotation.

```typescript
// myPlugin.plugin.ts

@PluginContainer
export class MyPlugin {
    constructor() {
    }

    @PluginHandler({
        myPlugin: {
            opt1: "Hello world"
        }
    })
    public async myPlugin(fastify: FastifyInstance,
                          opts: any,
                          done: () => void): Promise<void> {
        console.log(opts.myPlugin.opt1);
        // Outputs: Hello world
        // Do stuff with Fastify instance
        done();
    }
}
```

#### @PluginContainer

Indicates to the framework that methods within this class should be scanned for plugin handlers.

#### @PluginHandler(options?: FastifyPluginOptions)

Defines a Fastify plugin handler when used within a `@PluginController` class. This method will be automatically
registered with the Fastify instance.

### Plugin Objects

If your plugin doesn't need access to a class context, or you're importing from an external package, you can also define
a plugin as an object. You still need to put the object inside a file following the plugin name
convention `${name}.plugin.ts`

#### Example

```typescript
// myPlugin.plugin.ts

export const externalPlugin: PluginObject = {
    plugin: require("external-plugin")
}

export const myPlugin: PluginObject = {
    plugin: (fastify: FastifyInstance,
             opts: any,
             done: () => void): Promise<void> => {
        console.log(opts.myPlugin.opt1);
        done()
    },
    opts: {
        myPlugin: {
            opt1: "Hello world"
        }
    }
}
```
