import * as React from 'react';
import {autobind} from '@shopify/javascript-utilities/decorators';
import TextField from '../TextField';
import Icon from '../Icon';
import TextStyle from '../TextStyle';
import {Section as SectionType} from './types';
import {Section} from './components';
import * as styles from './StoreSwitcher.scss';

export interface BaseProps {
  sections: SectionType[];
  searchPlaceholder: string;
  noResultsMessage: string;
  activeStoreUrl: string;
  query?: string;
  onQueryChange(query: string): void;
}

interface Props extends BaseProps {
  children(
    searchField: React.ReactNode,
    storesList: React.ReactNode,
  ): React.ReactNode;
}

interface State {
  openSectionIds: string[];
}

class StoreSwitcher extends React.PureComponent<Props, State> {
  state = {
    openSectionIds: this.props.sections.reduce(
      (current, {name}) => [...current, name],
      [],
    ),
  };

  render() {
    const {
      query,
      searchPlaceholder,
      noResultsMessage,
      onQueryChange,
      sections,
      activeStoreUrl,
      children,
    } = this.props;
    const {openSectionIds} = this.state;

    const searchMarkup = this.hasSearch && (
      <div className={styles.Search}>
        <TextField
          labelHidden
          label=""
          value={query}
          onChange={onQueryChange}
          prefix={<Icon source="search" color="inkLightest" />}
          placeholder={searchPlaceholder}
        />
      </div>
    );

    const listMarkup =
      query && sections.length < 1 ? (
        <div className={styles.NoResults}>
          <TextStyle variation="subdued">{noResultsMessage}</TextStyle>
        </div>
      ) : (
        <section>
          {sections.map(({name, stores}) => {
            return (
              <Section
                id={name}
                key={name}
                name={name}
                stores={stores}
                activeStoreUrl={activeStoreUrl}
                onClick={this.handleSectionClick}
                open={openSectionIds.includes(name)}
              />
            );
          })}
        </section>
      );

    return children(searchMarkup, listMarkup);
  }

  @autobind
  private handleSectionClick(id: string) {
    const {openSectionIds} = this.state;
    if (openSectionIds.includes(id)) {
      this.setState({
        openSectionIds: openSectionIds.filter((currentId) => currentId !== id),
      });
      return;
    }
    this.setState({openSectionIds: [...openSectionIds, id]});
  }

  private get hasSearch() {
    const {sections} = this.props;
    const stores = sections.reduce(
      (current, {stores}) => [...current, ...stores],
      [],
    );
    return stores.length >= 5;
  }
}

export default StoreSwitcher;
