const fs = require('fs');
const path = require('path');
const glob = require('glob');
const grayMatter = require('gray-matter');

const blockList = [
  // No need to publish AppProvider as it is already implictly wrapped around every component
  'AppProvider',
];

const subcomponentList = {
  // Combobox is a sub component, TextField is an inlined defined function
  // that proxies through to Autocomplete.Combobox.TextField. Need to
  // refactor this to have TextField be directly under Autocomplete.
  // Combobox also exposes TextField and OptionList subcomponents however they
  // should never be used.
  // Instead of Autocomplete.Combobox.TextField use Autocomplete.TextField
  // Instead of Autocomplete.Combobox.OptionList use OptionList
  // Autocomplete: ['TextField', 'Combobox'],
  Card: ['Header', 'Section', 'SubSection'],
  // FileUpload exports a HoC, and deals with context, thus it won't work
  Dropzone: ['FileUpload'],
  FormLayout: ['Group'],
  Layout: ['AnnotatedSection', 'Section'],
  List: ['Item'],
  Modal: ['Dialog', 'Section'],
  // Navigation.UserMenu is deprecated
  Navigation: ['Item', 'Section'],
  Popover: ['Pane', 'Section'],
  // Item and FilterControl both export a Hoc and deal with context, thus they won't work
  ResourceList: ['Item', 'FilterControl'],
  Scrollable: ['ScrollTo'],
  Stack: ['Item'],
  Tabs: ['Panel'],
  // UseMenu and SearchField exports a Hoc and deals with context
  TopBar: ['UserMenu', 'SearchField', 'Menu'],
};

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
  .reduce((memo, {category, pathPart}) => {
    if (!memo[category]) {
      memo[category] = [];
    }

    if (!blockList.includes(pathPart)) {
      memo[category].push(`src/components/${pathPart}/${pathPart}.tsx`);

      if (subcomponentList[pathPart]) {
        const subcomponentPaths = subcomponentList[pathPart].map(
          (subcomponent) =>
            `src/components/${pathPart}/components/${subcomponent}/${subcomponent}.tsx`,
        );

        memo[category].push(...subcomponentPaths);
      }
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

module.exports = {
  name: 'Shopify Polaris',
  components: {
    categories: uxPinCategories,
  },
};
