import * as React from 'react';
import {autobind} from '@shopify/javascript-utilities/decorators';
import Icon from '../../../Icon';
import TextStyle from '../../../TextStyle';
import Image from '../../../Image';
import Popover, {MeasureOverlay} from '../../../Popover';
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
      activeStore,
      query,
      hasSearch,
      stores,
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

    const activator = (
      <button
        type="button"
        className={styles.Activator}
        onClick={this.togglePopover}
      >
        {logoMarkup}
        <span className={styles.StoreName}>
          <TextStyle variation="strong">{activeStore.name}</TextStyle>
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
      >
        {(measureOverlay: MeasureOverlay) => (
          <Switcher
            sections={sections}
            stores={stores}
            searchPlaceholder={searchPlaceholder}
            noResultsMessage={noResultsMessage}
            activeStore={activeStore}
            onQueryChange={onQueryChange}
            query={query}
            onSectionToggle={measureOverlay}
            hasSearch={hasSearch}
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
}

export default withAppProvider<Props>()(StoreSwitcher);
