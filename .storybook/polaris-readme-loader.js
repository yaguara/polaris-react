/* eslint-disable no-console */
const chalk = require('chalk');
const grayMatter = require('gray-matter');
const MdParser = require('./md-parser');
const React = require('react');

const HOOK_PREFIX = 'use';

/**
 * A Webpack loader, that expects a Polaris README file, and returns metadata,
 * and the examples contained within the readme.
 *
 * The `code` property of the examples are functions that will render a JSX
 * component when called with a scope object that contains React and Polaris's
 * exports. This allows us to inject all Polaris components into the function's
 * scope whilemaintaining the current scope that contains the Babel helper
 * functions. Unfortunatly this is only possible using eval() to
 * generate a function with the correct local scope by dynamically creating
 * a parameters list.
 */
module.exports = function loader(source) {
  this.cacheable();

  const readme = parseCodeExamples(source);

  const testIndividualExamples = ['Modal', 'Card'].includes(readme.name);

  const csfExports = readme.examples.map((example, i) => {
    const storyId = `Story${i}`;
    const code = JSON.stringify(`(${example.code})`);

    return `
const ${storyId}ComponentWithoutContext = ${example.code};

const ${storyId}Component = encapsulatedEval(Polaris, ${storyId}ComponentWithoutContext.toString())();

export const ${storyId} = () => <${storyId}Component/>;
${storyId}.story = {
  name: ${JSON.stringify(example.name)},
  decorators: [withA11y],
  parameters: {
    notes: ${JSON.stringify(example.description)},
    percy: {skip: ${JSON.stringify(testIndividualExamples)}},
  }
};
`.trim();
  });

  if (false && !testIndividualExamples) {
    allExamplesCode = readme.examples.map((example, i) => {
      // Add styles to prevent false positives in visual regression testing.
      // Set a minimum height so that examples don't shift and triger a failure
      // if an example above them changes height
      return `
<div key="Story${i}" style={{
    minHeight: '720px',
    borderBottom: '1px solid #000',
    marginBottom: '8px',
  }}>
  <Polaris.Heading>${example.name}</Polaris.Heading>
  <Story${i} />
</div>
`.trim();
    });

    csfExports.unshift(`export const AllExamples = function AllExamples() {
  return (
    <React.Fragment>
  ${allExamplesCode.join('\n')}
    </React.Fragment>
  );
};
AllExamples.story = {
  decorators: [withA11y],
  parameters: {
    percy: {skip: false},
    chromatic: {disable: true},
  }
}`);
  }

  const hooks = Object.keys(React)
    .filter((key) => key.startsWith(HOOK_PREFIX))
    .join(', ');

  return `
import React, {${hooks}} from 'react';
import {withA11y} from '@storybook/addon-a11y';
import * as Polaris from '@shopify/polaris';
import {
  PlusMinor,
  AlertMinor,
  ArrowDownMinor,
  ArrowLeftMinor,
  ArrowRightMinor,
  ArrowUpMinor,
  ArrowUpDownMinor,
  CalendarMinor,
  MobileCancelMajorMonotone,
  CancelSmallMinor,
  CaretDownMinor,
  CaretUpMinor,
  TickSmallMinor,
  ChevronDownMinor,
  ChevronLeftMinor,
  ChevronRightMinor,
  ChevronUpMinor,
  CircleCancelMinor,
  CircleChevronDownMinor,
  CircleChevronLeftMinor,
  CircleChevronRightMinor,
  CircleChevronUpMinor,
  CircleInformationMajorTwotone,
  CirclePlusMinor,
  CirclePlusOutlineMinor,
  ConversationMinor,
  DeleteMinor,
  CircleDisableMinor,
  DisputeMinor,
  DuplicateMinor,
  EmbedMinor,
  ExportMinor,
  ExternalMinor,
  QuestionMarkMajorTwotone,
  HomeMajorMonotone,
  HorizontalDotsMinor,
  ImportMinor,
  LogOutMinor,
  MobileHamburgerMajorMonotone,
  NoteMinor,
  NotificationMajorMonotone,
  OnlineStoreMajorTwotone,
  OrdersMajorTwotone,
  PrintMinor,
  ProductsMajorTwotone,
  ProfileMinor,
  RefreshMinor,
  RiskMinor,
  SaveMinor,
  SearchMinor,
  MinusMinor,
  ViewMinor,
} from '@shopify/polaris-icons';

function encapsulatedEval(env, code) {
  const fn = new Function(
    ...Object.keys(env),
    'return eval(' + JSON.stringify(code) + ')'
  );
  return fn.apply(this, Object.values(env));
}


export default { title: ${JSON.stringify(`All Components|${readme.name}`)} };

${csfExports.join('\n\n')}
`;
};

const exampleForRegExp = /<!-- example-for: ([\w\s,]+) -->/u;

function stripCodeBlock(block) {
  return block
    .replace(/```jsx/, '')
    .replace('```', '')
    .trim();
}

function isExampleForPlatform(exampleMarkdown, platform) {
  const foundExampleFor = exampleMarkdown.match(exampleForRegExp);

  if (!foundExampleFor) {
    return true;
  }

  return foundExampleFor[1].includes(platform);
}

function parseCodeExamples(data) {
  const matter = grayMatter(data);

  return {
    name: matter.data.name,
    category: matter.data.category,
    examples: generateExamples(matter),
  };
}

function generateExamples(matter) {
  if (matter.data.platforms && !matter.data.platforms.includes('web')) {
    const ignoredPlatforms = matter.data.platforms.join(',');
    console.log(
      chalk`ℹ️  {grey [${matter.data.name}] Component examples are ignored (platforms: ${ignoredPlatforms})}`,
    );

    return [];
  }

  if (matter.data.hidePlayground) {
    console.log(
      chalk`ℹ️  {grey [${matter.data.name}] Component examples are ignored (hidePlayground: true)}`,
    );

    return [];
  }

  const introAndComponentSections = matter.content
    .split(/(\n---\n)/)
    .map((content) => content.replace('---\n', '').trim())
    .filter((content) => content !== '');
  const [, ...componentSections] = introAndComponentSections;

  const examplesAndHeader = componentSections
    .filter((markdown) => markdown.startsWith('## Examples'))
    .join('')
    .split('###');

  const [, ...allExamples] = examplesAndHeader;

  if (allExamples.length === 0) {
    console.log(
      chalk`🚨 {red [${matter.data.name}]} No examples found. For troubleshooting advice see https://github.com/Shopify/polaris-react/blob/master/documentation/Component%20READMEs.md#troubleshooting`,
    );
  }

  const nameRegex = /(.)*/;
  const codeRegex = /```jsx(.|\n)*?```/g;

  const examples = allExamples
    .filter((example) => isExampleForPlatform(example, 'web'))
    .map((example) => {
      const nameMatches = example.match(nameRegex);
      const codeBlock = example.match(codeRegex);

      const name = nameMatches !== null ? nameMatches[0].trim() : '';
      const code =
        codeBlock !== null ? wrapExample(stripCodeBlock(codeBlock[0])) : '';

      const description = new MdParser().parse(
        filterMarkdownForPlatform(
          example
            .replace(nameRegex, '')
            .replace(codeRegex, '')
            .replace(exampleForRegExp, ''),
          'web',
        ).trim(),
      );

      return {name, code, description};
    });

  if (examples.filter((example) => example.code).length === 0) {
    console.log(
      chalk`🚨 {red [${matter.data.name}]} At least one React example expected`,
    );
  }

  examples.forEach((example) => {
    if (example.code === '') {
      console.log(
        chalk`🚨 {red [${matter.data.name}]} Example “${example.name}” is missing a React example`,
      );
    }
  });

  return examples;
}

function filterMarkdownForPlatform(markdown, platform) {
  const unwrapSinglePlatformContentRegExp = new RegExp(
    `<!-- content-for: ${platform} -->([\\s\\S]+?)<!-- \\/content-for -->`,
    'gu',
  );

  const deleteSinglePlatformContentRegExp = new RegExp(
    `<!-- content-for: (?:[\\w\\s]*) -->([\\s\\S]+?)<!-- \\/content-for -->`,
    'gu',
  );

  const unwrapMultiplatformContentRegExp = new RegExp(
    `<!-- content-for: (?:[\\w\\s,]*${platform}[\\w\\s,]*) -->([\\s\\S]+?)<!-- \\/content-for -->`,
    'gu',
  );
  const deleteRemainingPlatformsRegExp = /<!-- content-for: [\w\s,]+ -->[\s\S]+?<!-- \/content-for -->/gu;

  return (
    markdown
      // Unwrap content in multiple passes to support nested content-for blocks
      .replace(unwrapSinglePlatformContentRegExp, '$1')
      .replace(deleteSinglePlatformContentRegExp, '')
      .replace(unwrapMultiplatformContentRegExp, '$1')
      .replace(deleteRemainingPlatformsRegExp, '')
  );
}

function wrapExample(code) {
  const classPattern = /class (\w+) extends React.Component/g;
  const functionPattern = /^function (\w+)/g;
  const fullComponentDefinitionMatch =
    classPattern.exec(code) || functionPattern.exec(code);

  // return `() => () => 'hi'`;

  if (fullComponentDefinitionMatch) {
    return `function() {
    ${code}
    return ${fullComponentDefinitionMatch[1]};
  };`;
  } else {
    return `function () {
    return () => (
      ${code}
    );
  };`;
  }
}
