import { z } from "zod";

const cTypeVoid = "void";
const cTypeInt = "int";
const cTypeFloat = "float";
const cTypeDouble = "double";
const cTypeChar = "char";
const cTypeUnsignedChar = "unsigned char";
const cTypeCharArray = "char[]";

export const numbers = [cTypeInt, cTypeFloat, cTypeDouble];

export const cTypes = [
  cTypeVoid,
  ...numbers,
  cTypeChar,
  cTypeUnsignedChar,
  cTypeCharArray,
] as const;

const voidSchema = z
  .object({
    type: z.literal("void"),
    value: z.null(),
  })
  .strict();

const numbersSchema = z.union([
  z.object({
    type: z.literal(cTypeInt),
    value: z.number().int(),
  }),
  z.object({
    type: z.literal(cTypeFloat),
    value: z.number(),
  }),
  z.object({
    type: z.literal(cTypeDouble),
    value: z.number(),
  }),
]);

const charSchema = z
  .object({
    type: z.literal(cTypeChar),
    value: z.union([z.number().min(-128).max(127).int(), z.string().max(1)]),
  })
  .strict();

const unsignedSchema = z
  .object({
    type: z.literal(cTypeUnsignedChar),
    value: z.number().min(0).max(255).int(),
  })
  .strict();

const charArraySchema = z
  .object({
    type: z.literal(cTypeCharArray),
    value: z.string(),
  })
  .strict();

export const cTypesSchema = z.union([
  voidSchema,
  numbersSchema,
  charSchema,
  unsignedSchema,
  charArraySchema,
]);

export type CTypesSchema = z.infer<typeof cTypesSchema>;
