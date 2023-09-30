export async function flow<TFunction extends (...args: any) => any, Error>(
  fn: TFunction,
  onError: (error: unknown) => Error,
): Promise<ReturnType<TFunction> | Error> {
  try {
    return await fn();
  } catch (error) {
    return onError(error);
  }
}
