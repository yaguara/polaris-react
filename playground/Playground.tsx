import * as React from 'react';
import {noop} from '@shopify/javascript-utilities/other';
import {autobind} from '@shopify/javascript-utilities/decorators';
import {TopBar, AppProvider, Page, Frame} from '../src';

function generateStores(amount: number, prefix: string) {
  const stores = [];
  for (let i = 0; i < amount; i++) {
    stores.push({
      url: `https://little-victories.myshopify.io-${prefix}-${i}`,
      name: `Little Victories CA ${prefix}-${i}`,
    });
  }
  return stores;
}

function generateSections(amount: number, storesAmount: number) {
  const stores = [];
  for (let i = 0; i < amount; i++) {
    stores.push({
      name: `Business ${i}`,
      stores: generateStores(storesAmount, i.toString()),
    });
  }
  return stores;
}

const SECTIONS_AMOUNT = 2;
const STORES_AMOUNT = 5;

const sections = generateSections(SECTIONS_AMOUNT, STORES_AMOUNT);
const hasSearch = SECTIONS_AMOUNT * STORES_AMOUNT > 5;

export default class Playground extends React.Component<never, any> {
  state = {
    query: '',
    filteredSections: sections,
    showSearchMessage: false,
  };

  render() {
    const {query, showSearchMessage, filteredSections} = this.state;
    const storeSwitcher = (
      <TopBar.StoreSwitcher
        searchPlaceholder="Search for a shop."
        noResultsMessage={
          showSearchMessage &&
          `No stores found for ${query}, showing simular results.`
        }
        query={query}
        sections={filteredSections}
        activeStore={sections[0].stores[1]}
        onQueryChange={this.handleChange}
        hasSearch={hasSearch}
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

  @autobind
  private handleChange(query: string) {
    const filteredSections = sections
      .map(({name, stores}) => ({
        name,
        stores: stores.filter(({name}) =>
          name.toLowerCase().includes(query.toLowerCase()),
        ),
      }))
      .filter(({stores}) => stores.length > 0);

    this.setState({
      query,
      filteredSections,
      showSearchMessage: filteredSections.length === 0,
    });
  }
}
