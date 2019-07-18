const fs = require('fs');
const path = require('path');
const glob = require('glob');
const grayMatter = require('gray-matter');

// Notes: Items that still need presets:
// Forms: Everything
// Images and Icons: Icon (kinda broken due to how we import stuff)
// Feedback indicators : Toast (once it works?)
// Lists and tables : DataTable, ResourceList, OptionList (once they work)
// Overlays : Modal, Sheet, Popover (once they work)

// Items with problematic APIs
// PageActions primaryAction prop and Banner action prop does not appear
// Loading doesn't render at all
// Toast doesn't render at all
// TextField cant serialize properties
// ResourceList.Item cant serialize properties
// Scrollable can't serialize properties

// OptionList requires an onChange handler
// Modal, Sheet & Popover require onClose handlers
// Tooltip uses a portal so the active overlay doesn't appear

const blockList = [
  // No need to publish AppProvider as it is already implictly wrapped around every component
  'AppProvider',
  // VisuallyHidden has no visual output so it's not useful for visual design
  'VisuallyHidden',
  // If you open up a modal then it overlays the whole window, and is undismissable
  'Modal',
  // Doesn't work
  'Sheet',
  // For use in embedded applications only, is deprecated and will be removed from Polaris
  'ResourcePicker',
];

const subcomponentList = {
  // Autocomplete.Combobox exposes TextField and OptionList subcomponents
  // however they should never be used.
  // Instead of Autocomplete.Combobox.TextField use Autocomplete.TextField
  // Instead of Autocomplete.Combobox.OptionList use OptionList
  // Textfield currently causes an error as it conflicts with the top level TextField
  Autocomplete: ['TextField', 'Combobox'],
  Card: ['Header', 'Section', 'SubSection'],
  // FileUpload exports a HoC, and deals with context, thus it won't work
  DropZone: ['FileUpload'],
  FormLayout: ['Group'],
  Layout: ['AnnotatedSection', 'Section'],
  List: ['Item'],
  Modal: ['Dialog', 'Section'],
  // Navigation.UserMenu is deprecated, Item seems to be internal only and shouldn't be exposed
  Navigation: [/* 'Item',*/ 'Section'],
  Popover: ['Pane', 'Section'],
  // Item and FilterControl both export a Hoc and deal with context, thus they won't work
  ResourceList: ['Item', 'FilterControl'],
  Scrollable: ['ScrollTo'],
  Stack: ['Item'],
  // Tabs.Panel never seems to be internal only and shouldn't be exposed
  // Tabs: ['Panel'],
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
