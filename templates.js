import { COMPONENT_BASE_PATH } from './constant.js';
import fs from 'fs';
import path from 'path';
export const getComponentTemplate = (name) => `
import {styles} from "./styles.ts"
 const ${name} = () => {
  return (
    <div className={styles}>
      ${name}
    </div>
  );
};
export default ${name}
`;

export const getStoryTemplate = (name, category) => `
import { ${name} } from './ui/${name}';

export default {
  title: '${category}/${name}',
  component: ${name},
};

export const Primary = {
  args: {},
};
`;

export const getTestTemplate = (name) => `
import { render, screen } from '@testing-library/react';
import { ${name} } from './ui/${name}';

test('renders ${name}', () => {
  render(<${name} />);
  expect(screen.getByText('${name}')).toBeInTheDocument();
});
`;
export const getStylesTemplate = () =>
  `export const styles = 'p-4 bg-gray-100 text-gray-900 rounded'`;
export const getIndexTemplate = (name) => `export * from './ui/${name}';\n`;

export const updateBarrelExport = (category, name) => {
  const indexPath = path.join(COMPONENT_BASE_PATH, category, name, 'index.ts');
  const exportLine = `export * from './ui/Button';\n`;

  if (!fs.existsSync(indexPath)) {
    fs.writeFileSync(indexPath, exportLine);
  } else {
    const content = fs.readFileSync(indexPath, 'utf8');
    if (!content.includes(exportLine)) {
      fs.appendFileSync(indexPath, exportLine);
    }
  }
};
