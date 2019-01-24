import * as React from 'react';
import Image from '../../../Image';
import Scrollable from '../../../Scrollable';
import Menu from '../Menu';
import Switcher, {BaseProps as SwitcherProps} from '../../../StoreSwitcher';
import {withAppProvider, WithAppProviderProps} from '../../../AppProvider';
import * as styles from './StoreSwitcher.scss';

export type Props = SwitcherProps & {
  activatorAccessibilityLabel?: string;
};
type ComposedProps = Props & WithAppProviderProps;

function StoreSwitcher({
  stores,
  searchPlaceholder,
  activeIndex,
  noResultsMessage,
  activatorAccessibilityLabel,
  polaris: {
    theme: {logo},
  },
}: ComposedProps) {
  const {name: shopName} = stores[activeIndex];

  const logoMarkup = logo && (
    <Image
      source={logo.storeSwitcherSource || ''}
      alt={logo.accessibilityLabel || ''}
      className={styles.Logo}
    />
  );

  return (
    <Menu
      title={shopName}
      avatar={logoMarkup}
      activatorAccessibilityLabel={activatorAccessibilityLabel}
    >
      <Switcher
        stores={stores}
        searchPlaceholder={searchPlaceholder}
        activeIndex={activeIndex}
        noResultsMessage={noResultsMessage}
      >
        {(searchField, storesList) => (
          <React.Fragment>
            {searchField}
            <Scrollable vertical shadow>
              {storesList}
            </Scrollable>
          </React.Fragment>
        )}
      </Switcher>
    </Menu>
  );
}

export default withAppProvider<Props>()(StoreSwitcher);
