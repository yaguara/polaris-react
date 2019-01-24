import * as React from 'react';
import {autobind} from '@shopify/javascript-utilities/decorators';
import TextField from '../TextField';
import Icon from '../Icon';
import TextStyle from '../TextStyle';
import ActionList, {Props as ActionListProps} from '../ActionList';
import {Store} from './types';
import {transformStoresToItems, filterStores} from './utilities';
import * as styles from './StoreSwitcher.scss';

export interface BaseProps {
  stores: Store[];
  searchPlaceholder: string;
  activeIndex: number;
  noResultsMessage: string;
}

export interface Props extends BaseProps {
  children(
    searchField: React.ReactNode,
    content: React.ReactNode,
  ): React.ReactNode;
}

interface State {
  query: string;
  items: ActionListProps['items'];
}

const MIN_STORES_FOR_SEARCH = 5;

class StoreSwitcher extends React.Component<Props, State> {
  state = {
    query: '',
    items: transformStoresToItems(this.props.stores, this.props.activeIndex),
  };

  render() {
    const {query, items} = this.state;
    const {searchPlaceholder, stores, children, noResultsMessage} = this.props;
    const hasSearch = stores.length >= MIN_STORES_FOR_SEARCH;

    const searchFieldMarkup = hasSearch && (
      <div className={styles.Search}>
        <TextField
          labelHidden
          label=""
          value={query}
          onChange={this.handleQueryChange}
          prefix={<Icon source="search" color="inkLightest" />}
          placeholder={searchPlaceholder}
        />
      </div>
    );

    const storesListMarkup = (
      <section className={hasSearch && styles.StoresList}>
        <ActionList items={items} />
      </section>
    );

    const contentMarkup =
      query && items.length < 1 ? (
        <div className={styles.NoResults}>
          <TextStyle variation="subdued">{noResultsMessage}</TextStyle>
        </div>
      ) : (
        storesListMarkup
      );

    return children(searchFieldMarkup, contentMarkup);
  }

  @autobind
  private handleQueryChange(query: string) {
    const {stores, activeIndex} = this.props;
    this.setState({
      query,
      items: transformStoresToItems(filterStores(query, stores), activeIndex),
    });
  }
}

export default StoreSwitcher;
