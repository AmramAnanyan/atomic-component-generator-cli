import path from 'path';

export const ARROW_UP = '\u001B\u005B\u0041';
export const ARROW_DOWN = '\u001B\u005B\u0042';
export const CTRL_C = '\u0003';
export const ENTER_KEY = '\r';
export const COLOR_BLUE = '\x1b[36m';
export const RESET_STYLES = '\x1b[0m';
export const RED = '\x1b[31m';
export const GREEN = '\x1b[32m';
export const BOLD = '\x1b[1m';
export const MAGENTA = '\x1b[95m';

export const COMPONENT_BASE_PATH = path.join(
  process.cwd(),
  'src',
  'components'
);

export const CATEGORIES = [
  'atoms',
  'molecules',
  'organisms',
  'templates',
  'pages',
];
