import * as React from 'react';
import Image from '../../../Image';
import Menu from '../Menu';
import Switcher, {Props as SwitcherProps} from '../../../StoreSwitcher';
import {withAppProvider, WithAppProviderProps} from '../../../AppProvider';
import * as styles from './StoreSwitcher.scss';

export type Props = SwitcherProps & {
  activatorAccessibilityLabel?: string;
};
type ComposedProps = Props & WithAppProviderProps;

function StoreSwitcher({
  items,
  searchPlaceholder,
  activeIndex,
  noResultsMessage,
  activatorAccessibilityLabel,
  onQueryChange,
  polaris: {
    theme: {logo},
  },
}: ComposedProps) {
  const {name: shopName} = items[activeIndex];

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
        items={items}
        searchPlaceholder={searchPlaceholder}
        activeIndex={activeIndex}
        noResultsMessage={noResultsMessage}
        hasSearch={items.length >= 5}
        onQueryChange={onQueryChange}
      />
    </Menu>
  );
}

export default withAppProvider<Props>()(StoreSwitcher);
