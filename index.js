#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import {
  getComponentTemplate,
  getIndexTemplate,
  getStoryTemplate,
  getStylesTemplate,
  getTestTemplate,
  updateBarrelExport,
} from './templates.js';
import {
  CATEGORIES,
  RED,
  RESET_STYLES,
  COLOR_BLUE,
  COMPONENT_BASE_PATH,
  CTRL_C,
  ENTER_KEY,
  ARROW_DOWN,
  ARROW_UP,
  GREEN,
  BOLD,
  MAGENTA,
} from './constant.js';

const showArrowMenu = () => {
  return new Promise((resolve) => {
    let selected = 0;

    const renderMenu = () => {
      console.clear();
      console.log(
        MAGENTA + BOLD + 'Design System Component Generator' + RESET_STYLES
      );
      console.log(
        GREEN + BOLD + 'Use ↑ ↓ arrows and press Enter:\n' + RESET_STYLES
      );

      CATEGORIES.forEach((item, index) => {
        const prefix = index === selected ? '› ' : '  ';
        const color = index === selected ? COLOR_BLUE : RESET_STYLES;
        console.log(color + prefix + item + RESET_STYLES);
      });
    };
    renderMenu();
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    const onKeyPress = (key) => {
      if (key === CTRL_C) process.exit();
      if (key === ENTER_KEY) {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdin.removeListener('data', onKeyPress);
        return resolve(CATEGORIES[selected]);
      }
      if (key === ARROW_UP) {
        selected = (selected - 1 + CATEGORIES.length) % CATEGORIES.length;
        renderMenu();
      }
      if (key === ARROW_DOWN) {
        selected = (selected + 1) % CATEGORIES.length;
        renderMenu();
      }
    };

    process.stdin.on('data', onKeyPress);
  });
};

const ask = (label) => {
  console.log(COLOR_BLUE + label + RESET_STYLES);
  return new Promise((resolve, reject) => {
    process.stdin.resume();
    process.stdin.setRawMode(false);
    const handleInputValue = (input) => {
      process.stdin.setRawMode();
      if (!input.trim()) {
        console.error(RED + 'COMPONENT NAME IS REQUIRED' + RESET_STYLES);
        process.stdin.removeAllListeners('data', handleInputValue);
        process.stdin.destroy();
        return;
      }
      console.log(
        COLOR_BLUE +
          'Component created successful: ' +
          RESET_STYLES +
          GREEN +
          input +
          RESET_STYLES
      );
      process.stdin.removeAllListeners('data', handleInputValue);
      process.stdin.destroy();
      resolve(input);
    };
    process.stdin.on('data', handleInputValue);
  });
};

const createComponent = (category, name) => {
  const compPath = path.join(COMPONENT_BASE_PATH, category, name);
  const cleanPath = compPath.trim();
  const cleanName = name.trim();
  const uiPath = path.join(cleanPath, 'ui');
  const testPath = path.join(cleanPath, 'tests');
  const storiesPath = path.join(cleanPath, 'stories');

  if (fs.existsSync(cleanPath)) {
    console.log(
      RED + `Component "${cleanName}" already exists.` + RESET_STYLES
    );
    return;
  }

  fs.mkdirSync(uiPath, { recursive: true });
  fs.mkdirSync(testPath, { recursive: true });
  fs.mkdirSync(storiesPath, { recursive: true });

  fs.writeFileSync(
    path.join(uiPath, `${cleanName}.tsx`),
    getComponentTemplate(cleanName)
  );
  fs.writeFileSync(
    path.join(uiPath, `styles.ts`),
    getStylesTemplate(cleanName)
  );
  fs.writeFileSync(
    path.join(storiesPath, `${cleanName}.stories.tsx`),
    getStoryTemplate(cleanName, category)
  );
  fs.writeFileSync(
    path.join(testPath, `${cleanName}.test.tsx`),
    getTestTemplate(cleanName)
  );
  fs.writeFileSync(
    path.join(cleanPath, `index.ts`),
    getIndexTemplate(cleanName)
  );
  updateBarrelExport(category, cleanName);

  console.log(
    `${COLOR_BLUE}Created: ${GREEN}${category}/${cleanName}` + RESET_STYLES
  );
};

(async () => {
  const category = await showArrowMenu();
  const name = await ask('\nTYPE COMPONENT NAME AND PRESS ENTER ↓');
  if (!name) {
    console.log('Name required.');
    return;
  }
  createComponent(category, name);
})();
