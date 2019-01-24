import * as React from 'react';
import {mountWithAppProvider, trigger} from 'test-utilities';
import {filterStores, transformStoresToItems} from '../utilities';
import ActionList from '../../ActionList';
import TextField from '../../TextField';
import StoreSwitcher from '../StoreSwitcher';

describe('<StoreSwitcher />', () => {
  const mockProps = {
    stores: [],
    searchPlaceholder: '',
    activeIndex: 0,
    noResultsMessage: '',
    children(searchField: React.ReactNode, content: React.ReactNode) {
      return (
        <React.Fragment>
          {searchField}
          {content}
        </React.Fragment>
      );
    },
  };

  describe('stores', () => {
    it('is used to construct the action list items', () => {
      const stores = [
        {
          name: '',
          url: '',
        },
      ];
      const activeIndex = 0;
      const storeSwitcher = mountWithAppProvider(
        <StoreSwitcher
          {...mockProps}
          stores={stores}
          activeIndex={activeIndex}
        />,
      );
      const expectedItems = transformStoresToItems(stores, activeIndex);
      expect(storeSwitcher.find(ActionList).prop('items')).toEqual(
        expectedItems,
      );
    });

    it('shows a search field when there are 5 or more stores', () => {
      const stores = new Array(5).fill({
        name: '',
        url: '',
      });
      const storeSwitcher = mountWithAppProvider(
        <StoreSwitcher {...mockProps} stores={stores} />,
      );
      expect(storeSwitcher.find(TextField)).toHaveLength(1);
    });

    it('filters the stores when the search query changes', () => {
      const stores = [
        {
          name: 'Little Victories CA',
          url: 'http://little-victories.com',
        },
        {
          name: 'Toy Company',
          url: 'http://toy-company.com',
        },
        ...new Array(3).fill({
          name: '',
          url: '',
        }),
      ];
      const newQuery = 'toy';
      const activeIndex = 0;
      const newItems = transformStoresToItems(
        filterStores(newQuery, stores),
        activeIndex,
      );
      const storeSwitcher = mountWithAppProvider(
        <StoreSwitcher
          {...mockProps}
          stores={stores}
          activeIndex={activeIndex}
        />,
      );
      trigger(storeSwitcher.find(TextField), 'onChange', newQuery);
      expect(storeSwitcher.find(ActionList).prop('items')).toEqual(newItems);
    });

    it('renders the no results message when there are no stores found', () => {
      const noResultsMessage = 'No stores found.';
      const stores = new Array(5).fill({
        name: '',
        url: '',
      });
      const storeSwitcher = mountWithAppProvider(
        <StoreSwitcher
          {...mockProps}
          stores={stores}
          activeIndex={0}
          noResultsMessage={noResultsMessage}
        />,
      );
      trigger(storeSwitcher.find(TextField), 'onChange', 'toy');
      expect(storeSwitcher.contains(noResultsMessage)).toBeTruthy();
    });
  });

  describe('searchPlaceholder', () => {
    it('gets passed into the search field', () => {
      const stores = new Array(5).fill({
        name: '',
        url: '',
      });
      const searchPlaceholder = 'Search for a shop.';
      const storeSwitcher = mountWithAppProvider(
        <StoreSwitcher
          {...mockProps}
          stores={stores}
          searchPlaceholder={searchPlaceholder}
        />,
      );
      expect(storeSwitcher.find(TextField).prop('placeholder')).toBe(
        searchPlaceholder,
      );
    });
  });

  describe('children', () => {
    it('is used to render the content', () => {
      const content = <div />;
      const storeSwitcher = mountWithAppProvider(
        <StoreSwitcher {...mockProps}>{() => content}</StoreSwitcher>,
      );
      expect(storeSwitcher.contains(content)).toBeTruthy();
    });

    it('receives the search and content markup', () => {
      const childrenSpy = jest.fn(() => null);
      const stores = new Array(5).fill({
        name: '',
        url: '',
      });
      mountWithAppProvider(
        <StoreSwitcher {...mockProps} stores={stores}>
          {childrenSpy}
        </StoreSwitcher>,
      );
      const {
        mock: {
          calls: [[searchFieldMarkup, contentMarkup]],
        },
      } = childrenSpy;
      const argumentsMarkup = mountWithAppProvider(
        <React.Fragment>
          {searchFieldMarkup}
          {contentMarkup}
        </React.Fragment>,
      );
      expect(argumentsMarkup.find(TextField)).toHaveLength(1);
      expect(argumentsMarkup.find(ActionList)).toHaveLength(1);
    });
  });
});
