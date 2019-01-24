import * as React from 'react';
import {
  shallowWithAppProvider,
  mountWithAppProvider,
  trigger,
} from 'test-utilities';
import Switcher from '../../../../StoreSwitcher';
import Image from '../../../../Image';
import Popover from '../../../../Popover';
import StoreSwitcher from '../StoreSwitcher';

describe('<StoreSwitcher />', () => {
  const mockProps = {
    stores: [
      {
        name: '',
        url: '',
      },
    ],
    activeIndex: 0,
    searchPlaceholder: '',
    noResultsMessage: '',
  };

  describe('stores', () => {
    it('gets passed into the switcher', () => {
      const stores = [
        {
          name: '',
          url: '',
        },
      ];
      const storeSwitcher = shallowWithAppProvider(
        <StoreSwitcher {...mockProps} stores={stores} />,
      );
      expect(storeSwitcher.find(Switcher).prop('stores')).toEqual(stores);
    });

    it('displays the name of the active shop', () => {
      const activeShopName = 'Little Victories CA';
      const stores = [
        {
          name: activeShopName,
          url: '',
        },
      ];
      const storeSwitcher = mountWithAppProvider(
        <StoreSwitcher {...mockProps} stores={stores} activeIndex={0} />,
      );
      expect(storeSwitcher.contains(activeShopName)).toBeTruthy();
    });
  });

  describe('searchPlaceholder', () => {
    it('gets passed into the switcher', () => {
      const searchPlaceholder = 'Search for a shop.';
      const storeSwitcher = shallowWithAppProvider(
        <StoreSwitcher {...mockProps} searchPlaceholder={searchPlaceholder} />,
      );
      expect(storeSwitcher.find(Switcher).prop('searchPlaceholder')).toBe(
        searchPlaceholder,
      );
    });
  });

  describe('activeIndex', () => {
    it('gets passed into the switcher', () => {
      const activeIndex = 0;
      const storeSwitcher = shallowWithAppProvider(
        <StoreSwitcher {...mockProps} activeIndex={activeIndex} />,
      );
      expect(storeSwitcher.find(Switcher).prop('activeIndex')).toBe(
        activeIndex,
      );
    });
  });

  describe('noResultsMessage', () => {
    it('gets passed into the switcher', () => {
      const noResultsMessage = 'No stores found.';
      const storeSwitcher = shallowWithAppProvider(
        <StoreSwitcher {...mockProps} noResultsMessage={noResultsMessage} />,
      );
      expect(storeSwitcher.find(Switcher).prop('noResultsMessage')).toBe(
        noResultsMessage,
      );
    });
  });

  describe('<Image />', () => {
    it('renders the logo if there is one', () => {
      const logoSource = './company-logo.png';
      const logoAccessibilityLabel = 'Company Logo';
      const storeSwitcher = mountWithAppProvider(
        <StoreSwitcher {...mockProps} />,
        {
          context: {
            polarisTheme: {
              logo: {
                storeSwitcherSource: logoSource,
                accessibilityLabel: logoAccessibilityLabel,
              },
            },
          },
        },
      );
      expect(storeSwitcher.find(Image).props()).toEqual(
        expect.objectContaining({
          source: logoSource,
          alt: logoAccessibilityLabel,
        }),
      );
    });
  });

  describe('button', () => {
    it('toggles the popover when clicked', () => {
      const storeSwitcher = mountWithAppProvider(
        <StoreSwitcher {...mockProps} />,
      );
      trigger(storeSwitcher.find('button').first(), 'onClick');
      expect(storeSwitcher.find(Popover).prop('active')).toBeTruthy();
      trigger(storeSwitcher.find('button').first(), 'onClick');
      expect(storeSwitcher.find(Popover).prop('active')).toBeFalsy();
    });
  });

  describe('<Popover />', () => {
    it('is closed by default', () => {
      const storeSwitcher = mountWithAppProvider(
        <StoreSwitcher {...mockProps} />,
      );
      expect(storeSwitcher.find(Popover).prop('active')).toBeFalsy();
    });

    it('closes when the popover closes', () => {
      const storeSwitcher = mountWithAppProvider(
        <StoreSwitcher {...mockProps} />,
      );
      trigger(storeSwitcher.find('button').first(), 'onClick');
      trigger(storeSwitcher.find(Popover), 'onClose');
      expect(storeSwitcher.find(Popover).prop('active')).toBeFalsy();
    });
  });
});
