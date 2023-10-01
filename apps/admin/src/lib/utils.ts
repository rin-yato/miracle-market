import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import type { SuperValidated, ZodValidation } from 'sveltekit-superforms';
import type { z } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
  y?: number;
  x?: number;
  start?: number;
  duration?: number;
};

export const flyAndScale = (
  node: Element,
  params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 },
): TransitionConfig => {
  const style = getComputedStyle(node);
  const transform = style.transform === 'none' ? '' : style.transform;

  const scaleConversion = (
    valueA: number,
    scaleA: [number, number],
    scaleB: [number, number],
  ) => {
    const [minA, maxA] = scaleA;
    const [minB, maxB] = scaleB;

    const percentage = (valueA - minA) / (maxA - minA);
    const valueB = percentage * (maxB - minB) + minB;

    return valueB;
  };

  const styleToString = (
    style: Record<string, number | string | undefined>,
  ): string =>
    Object.keys(style).reduce((str, key) => {
      if (style[key] === undefined) return str;
      return `str${key}:${style[key]};`;
    }, '');

  return {
    duration: params.duration ?? 200,
    delay: 0,
    css: (t) => {
      const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
      const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
      const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

      return styleToString({
        transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        opacity: t,
      });
    },
    easing: cubicOut,
  };
};

export type FormSubmitEvent<
  T extends SuperValidated<ZodValidation<z.AnyZodObject>>,
> = {
  form: T;
  formEl: HTMLFormElement;
  cancel: () => void;
};

export const handleFormSubmit =
  <T extends SuperValidated<ZodValidation<z.AnyZodObject>>>(
    form: T,
    callback: (event: FormSubmitEvent<T>) => void,
  ) =>
  (event: FormSubmitEvent<T>) => {
    if (event.form.valid) {
      callback(event);
    }
  };

export const parseError = (error: unknown) => {
  let err: unknown;
  try {
    if (typeof error === 'string') {
      try {
        err = JSON.parse(error);
        if (
          err &&
          typeof err === 'object' &&
          'message' in err &&
          'cause' in err &&
          'name' in err
        ) {
          return err as Error;
        }
      } catch (_) {
        return new Error(error, { cause: err });
      }
    }

    if (err instanceof Error) {
      return err;
    }
    return new Error('Unknown error', { cause: err });
  } catch (error) {
    err = error;
    return new Error('Unknown error', { cause: err });
  }
};
