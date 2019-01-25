import * as React from 'react';
import {TopBar, AppProvider, Navigation, Page, Frame} from '../src';

const sections = [
  {
    name: 'Business #1',
    stores: [
      {
        url: 'https://little-victories.myshopify.io1',
        name: 'Little Victories CA',
        active: true,
      },
      {
        url: 'https://little-victories.myshopify.io2',
        name: 'Little Victories CA',
      },
      {
        url: 'https://little-victories.myshopify.io3',
        name:
          "Little Victories Europe Division over the rainbow where only Tobi can see it and maybe Jakob but that's it okay maybe Anthony.",
      },
      {
        url: 'https://little-victories.myshopify.io4',
        name: 'Little Victories CA',
      },
    ],
  },
];

export default class Playground extends React.Component<never, any> {
  render() {
    const storeSwitcher = (
      <TopBar.StoreSwitcher
        searchPlaceholder="Search for a shop."
        noResultsMessage="No stores found."
        activeIndex={0}
        sections={sections}
        activeStoreUrl="https://little-victories.myshopify.io3"
      />
    );

    const topBar = (
      <TopBar showNavigationToggle storeSwitcher={storeSwitcher} />
    );

    return (
      <AppProvider
        theme={{
          logo: {
            storeSwitcherSource:
              'https://cdn.shopify.com/s/files/1/0048/7889/3112/t/1/assets/jaded-pixel-logo-icon-color.svg?9067931593300480340',
          },
        }}
      >
        <Frame topBar={topBar} showMobileNavigation>
          <Page title="Playground" />
        </Frame>
      </AppProvider>
    );
  }
}
