import * as React from 'react';
import {autobind} from '@shopify/javascript-utilities/decorators';
import Icon from '../../../Icon';
import TextStyle from '../../../TextStyle';
import Image from '../../../Image';
import Popover from '../../../Popover';
import Switcher, {Props as SwitcherProps} from '../../../StoreSwitcher';
import {withAppProvider, WithAppProviderProps} from '../../../AppProvider';
import * as styles from './StoreSwitcher.scss';

export type Props = SwitcherProps;
type ComposedProps = Props & WithAppProviderProps;

interface State {
  open: boolean;
}

class StoreSwitcher extends React.Component<ComposedProps, State> {
  state = {
    open: true,
  };

  render() {
    const {open} = this.state;
    const {
      sections,
      searchPlaceholder,
      noResultsMessage,
      onQueryChange,
      activeStoreUrl,
      polaris: {
        theme: {logo},
      },
    } = this.props;

    const logoMarkup = logo && (
      <Image
        source={logo.storeSwitcherSource || ''}
        alt={logo.accessibilityLabel || ''}
        className={styles.Logo}
      />
    );

    // eslint-disable-next-line typescript/no-non-null-assertion
    const {name} = this.activeStore!;

    const activator = (
      <button
        type="button"
        className={styles.Activator}
        onClick={this.togglePopover}
      >
        {logoMarkup}
        <span className={styles.StoreName}>
          <TextStyle variation="strong">{name}</TextStyle>
        </span>
        <span className={styles.Icon}>
          <Icon source="chevronDown" color="white" />
        </span>
      </button>
    );

    return (
      <Popover
        active={open}
        activator={activator}
        onClose={this.togglePopover}
        preferredAlignment="left"
        fullHeight
        noWrap
      >
        {(measureOverlay) => (
          <Switcher
            sections={sections}
            searchPlaceholder={searchPlaceholder}
            noResultsMessage={noResultsMessage}
            activeStoreUrl={activeStoreUrl}
            onQueryChange={onQueryChange}
            onSectionToggle={measureOverlay}
          >
            {(searchField, storesList) => (
              <>
                {searchField}
                <Popover.Pane>{storesList}</Popover.Pane>
              </>
            )}
          </Switcher>
        )}
      </Popover>
    );
  }

  @autobind
  private togglePopover() {
    const {open} = this.state;
    this.setState({open: !open});
  }

  private get activeStore() {
    const {sections, activeStoreUrl} = this.props;
    for (const {stores} of sections) {
      const activeStore = stores.find(({url}) => url === activeStoreUrl);
      if (activeStore) {
        return activeStore;
      }
    }
  }
}

export default withAppProvider<Props>()(StoreSwitcher);
