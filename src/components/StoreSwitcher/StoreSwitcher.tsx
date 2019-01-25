import * as React from 'react';
import {autobind} from '@shopify/javascript-utilities/decorators';
import {createUniqueIDFactory} from '@shopify/javascript-utilities/other';
import TextField from '../TextField';
import Icon from '../Icon';
import TextStyle from '../TextStyle';
import {Section as SectionType} from './types';
import {Section} from './components';
import * as styles from './StoreSwitcher.scss';

export interface Props {
  sections: SectionType[];
  hasSearch: boolean;
  searchPlaceholder: string;
  noResultsMessage: string;
  activeStoreUrl: string;
  onQueryChange(query: string): void;
  query?: string;
}

interface State {
  openSectionIds: string[];
}

class StoreSwitcher extends React.PureComponent<Props, State> {
  state = {
    openSectionIds: ['Business #1'],
  };

  render() {
    const {
      query,
      searchPlaceholder,
      noResultsMessage,
      onQueryChange,
      sections,
      activeStoreUrl,
      hasSearch,
    } = this.props;
    const {openSectionIds} = this.state;

    const searchMarkup = hasSearch && (
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

    const contentMarkup =
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

    return (
      <>
        {searchMarkup}
        {contentMarkup}
      </>
    );
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
}

export default StoreSwitcher;
