import * as React from 'react';
import {autobind} from '@shopify/javascript-utilities/decorators';
import Icon from '../../../Icon';
import TextStyle from '../../../TextStyle';
import Image from '../../../Image';
import Popover from '../../../Popover';
import Switcher, {BaseProps as SwitcherProps} from '../../../StoreSwitcher';
import {withAppProvider, WithAppProviderProps} from '../../../AppProvider';
import * as styles from './StoreSwitcher.scss';

export type Props = SwitcherProps;
type ComposedProps = Props & WithAppProviderProps;

interface State {
  open: boolean;
}

class StoreSwitcher extends React.Component<ComposedProps, State> {
  state = {
    open: false,
  };

  render() {
    const {open} = this.state;
    const {
      stores,
      searchPlaceholder,
      activeIndex,
      noResultsMessage,
      polaris: {
        theme: {logo},
      },
    } = this.props;

    const {name} = this.activeShop;
    const logoMarkup = logo && (
      <Image
        source={logo.storeSwitcherSource || ''}
        alt={logo.accessibilityLabel || ''}
        className={styles.Logo}
      />
    );

    const activator = (
      <button
        type="button"
        className={styles.Activator}
        onClick={this.togglePopover}
      >
        {logoMarkup}
        <span className={styles.ShopName}>
          <TextStyle variation="strong">{name}</TextStyle>
        </span>
        <span className={styles.Icon}>
          <Icon source="chevronDown" color="white" />
        </span>
      </button>
    );

    return (
      <Switcher
        stores={stores}
        searchPlaceholder={searchPlaceholder}
        activeIndex={activeIndex}
        noResultsMessage={noResultsMessage}
      >
        {(searchField, storesList) => (
          <Popover
            fullHeight
            active={open}
            activator={activator}
            onClose={this.togglePopover}
            preferredAlignment="left"
            noWrap
          >
            {searchField}
            <Popover.Pane>{storesList}</Popover.Pane>
          </Popover>
        )}
      </Switcher>
    );
  }

  @autobind
  private togglePopover() {
    const {open} = this.state;
    this.setState({open: !open});
  }

  private get activeShop() {
    const {stores, activeIndex} = this.props;
    return stores[activeIndex];
  }
}

export default withAppProvider<Props>()(StoreSwitcher);
