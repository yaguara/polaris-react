const fs = require('fs');
const path = require('path');
const glob = require('glob');
const grayMatter = require('gray-matter');

const blockList = [
  // Throws "TypeError: Cannot read property 'kind' of undefined" error
  'ChoiceList',

  // Thows "Error: No component found!"
  'ContextualSaveBar',
  'InlineError',
  'Tag',
  'TextField',
  'Icon',
  'ProgressBar',
  'Spinner',
  'Scrollable',
  'Pagination',

  // TODO Needs presets // subcomponent stuff
  'Card',
];

const readmeMetadatas = glob
  .sync(path.resolve(__dirname, 'src/components/*/README.md'))
  .filter((readmePath) =>
    fs.existsSync(readmePath.replace(/README\.md$/, 'index.ts')),
  )
  .map((readme) => ({
    pathPart: path.dirname(
      path.relative(`${__dirname}/src/components`, readme),
    ),
    category: grayMatter(fs.readFileSync(readme)).data.category,
  }))
  .reduce((memo, component) => {
    if (!memo[component.category]) {
      memo[component.category] = [];
    }

    if (!blockList.includes(component.pathPart)) {
      memo[component.category].push(
        `src/components/${component.pathPart}/${component.pathPart}.tsx`,
      );
    }
    return memo;
  }, {});

const uxPinCategories = Object.entries(readmeMetadatas).reduce(
  (memo, [name, include]) => {
    memo.push({name, include});
    return memo;
  },
  [],
);

// TODO bring back sub components
// 'src/components/Card/components/Header/Header.tsx',
// 'src/components/Card/components/Section/Section.tsx',

module.exports = {
  name: 'Shopify Polaris',
  components: {
    categories: uxPinCategories,
  },
};
