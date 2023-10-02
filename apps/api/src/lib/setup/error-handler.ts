import type { ErrorHandler } from 'elysia';

export const errorHandler: ErrorHandler = ({ error }) => {
  return error;
};
