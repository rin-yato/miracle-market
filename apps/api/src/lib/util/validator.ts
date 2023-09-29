import type { TSchema } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

export function validator<T extends TSchema, V>(schema: T, value: V) {
  const isValid = Value.Check(schema, value);

  if (!isValid) {
    const errorMessage = Value.Errors(schema, value).First();
    throw new Error(String(errorMessage?.schema.error));
  }

  return Value.Cast(schema, value);
}
