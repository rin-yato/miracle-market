const ESCAPE = '\x1B';
const DEFAULT_TEXT_FORMAT = '\x1B[0m';
const DEFAULT_FG_BG = `${ESCAPE}[0m`;
const RED_CODE = 9;
const LUCIA_COLOR_CODE = 63;
const WHITE_CODE = 231;
const GREEN_CODE = 34;
const CYAN_CODE = 6;
const YELLOW_CODE = 3;
const PURPLE_CODE = 5;
const BLUE_CODE = 4;

const format = (
  text: string,
  format: string,
  removeFormat?: string,
): string => {
  return `${format}${text}${removeFormat ? removeFormat : DEFAULT_TEXT_FORMAT}`;
};

const bgFormat = (text: string, colorCode: number): string => {
  return format(text, `${ESCAPE}[48;5;${colorCode}m`, DEFAULT_FG_BG);
};

const fgFormat = (text: string, colorCode: number): string => {
  return format(text, `${ESCAPE}[38;5;${colorCode}m`, DEFAULT_FG_BG);
};

export const bg = {
  lucia: (text: string) => bgFormat(text, LUCIA_COLOR_CODE),
  red: (text: string) => bgFormat(text, RED_CODE),
  white: (text: string) => bgFormat(text, WHITE_CODE),
  green: (text: string) => bgFormat(text, GREEN_CODE),
  cyan: (text: string) => bgFormat(text, CYAN_CODE),
  yellow: (text: string) => bgFormat(text, YELLOW_CODE),
  purple: (text: string) => bgFormat(text, PURPLE_CODE),
  blue: (text: string) => bgFormat(text, BLUE_CODE),
} as const;

export const fg = {
  lucia: (text: string) => fgFormat(text, LUCIA_COLOR_CODE),
  red: (text: string) => fgFormat(text, RED_CODE),
  white: (text: string) => fgFormat(text, WHITE_CODE),
  green: (text: string) => fgFormat(text, GREEN_CODE),
  cyan: (text: string) => fgFormat(text, CYAN_CODE),
  yellow: (text: string) => fgFormat(text, YELLOW_CODE),
  purple: (text: string) => fgFormat(text, PURPLE_CODE),
  blue: (text: string) => fgFormat(text, BLUE_CODE),
  default: (text: string) => format(text, DEFAULT_TEXT_FORMAT),
} as const;

export const bold = (text: string): string => {
  return format(text, `${ESCAPE}[1m`, `${ESCAPE}[22m`);
};

export const dim = (text: string): string => {
  return format(text, `${ESCAPE}[2m`, `${ESCAPE}[22m`);
};

type LogType = 'info' | 'error' | 'warn' | 'debug';
type LogFn = (title: string, message: any, ...optional: any[]) => void;

type Logger = Record<LogType, LogFn>;

const lineBreak = () => console.log('');

export const logger: Logger = {
  info: (title, message, ...optional) => {
    console.log(
      dim(new Date().toLocaleTimeString()),
      bold(fg.lucia(`${title}`)),
      message,
      ...optional,
    );
    lineBreak();
  },
  debug: (title, message, ...optional) => {
    console.log(
      dim(new Date().toLocaleTimeString()),
      bold(fg.cyan(`${title}`)),
      message,
      ...optional,
    );
    lineBreak();
  },
  error: (title, message, ...optional) => {
    console.log(
      dim(new Date().toLocaleTimeString()),
      bold(fg.red(`${title}`)),
      message,
      ...optional,
    );
    lineBreak();
  },
  warn: (title, message, ...optional) => {
    console.log(
      dim(new Date().toLocaleTimeString()),
      bold(fg.yellow(`${title}`)),
      message,
      ...optional,
    );
    lineBreak();
  },
};
