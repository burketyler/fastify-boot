export interface HookOptions {
  name: HookName;
}

export const hookNameList = [
  "onRequest",
  "preParsing",
  "preValidation",
  "preHandler",
  "preSerialization",
  "onError",
  "onSend",
  "onResponse",
  "onTimeout",
];

export type HookName =
  | "onRequest"
  | "preParsing"
  | "preValidation"
  | "preHandler"
  | "preSerialization"
  | "onError"
  | "onSend"
  | "onResponse"
  | "onTimeout";
