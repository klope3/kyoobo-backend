import { z } from "zod";

export const intParseableString = z
  .string()
  .refine((str) => !isNaN(parseInt(str)));

export function parseObjWithId(obj: any) {
  const schema = z.object({
    id: z.number(),
  });
  return schema.parse(obj);
}
