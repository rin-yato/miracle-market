import type { TSchema } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

export function validator<T extends TSchema, V>(schema: T, value: V) {
  const C = TypeCompiler.Compile(schema);
  return C.Decode(value);
}
