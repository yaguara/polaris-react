import * as React from 'react';
import escape from 'lodash/escape';
import {autobind} from '@shopify/javascript-utilities/decorators';
import TextField from '../TextField';
import Icon from '../Icon';
import TextStyle from '../TextStyle';
import {Section, StoresList, StoreType} from './components';
import * as styles from './StoreSwitcher.scss';

interface SectionType {
  name: string;
  stores: StoreType[];
}

export interface BaseProps {
  sections: SectionType[];
  noResultsMessage: string;
  activeStore: StoreType;
  searchPlaceholder: string;
  query?: string;
  hasSearch: boolean;
  onQueryChange(query: string): void;
}

interface Props extends BaseProps {
  onSectionToggle?(): void;
  children(
    searchField: React.ReactNode,
    content: React.ReactNode,
  ): React.ReactNode;
}

interface State {
  openSectionIds: string[];
}

class StoreSwitcher extends React.PureComponent<Props, State> {
  state = {
    openSectionIds: this.allSectionIds,
  };

  render() {
    const {
      query,
      searchPlaceholder,
      onQueryChange,
      sections,
      activeStore,
      children,
      hasSearch,
    } = this.props;
    const {openSectionIds} = this.state;
    const {noResultsMessage} = this;

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

    const noResultsMessageMarkup = noResultsMessage && (
      <div className={styles.NoResults}>
        <TextStyle variation="subdued">
          <span dangerouslySetInnerHTML={{__html: noResultsMessage}} />
        </TextStyle>
      </div>
    );

    const sectionsMarkup =
      sections.length > 1 ? (
        sections.map(({name, stores}) => (
          <Section
            id={name}
            key={name}
            name={name}
            onClick={this.handleSectionClick}
            open={openSectionIds.includes(name)}
          >
            <StoresList
              stores={stores}
              activeStoreUrl={activeStore.url}
              highlight={query}
            />
          </Section>
        ))
      ) : (
        <StoresList
          stores={sections[0].stores}
          activeStoreUrl={activeStore.url}
          highlight={query}
        />
      );

    const contentMarkup = sections && (
      <>
        {noResultsMessageMarkup}
        {sectionsMarkup}
      </>
    );

    return children(searchMarkup, contentMarkup);
  }

  @autobind
  private handleSectionClick(id: string) {
    const {openSectionIds} = this.state;
    const {onSectionToggle} = this.props;

    const updateState = (partialState: State) =>
      this.setState(partialState, () => onSectionToggle && onSectionToggle());

    if (openSectionIds.includes(id)) {
      updateState({
        openSectionIds: openSectionIds.filter((currentId) => currentId !== id),
      });
      return;
    }

    updateState({openSectionIds: [...openSectionIds, id]});
  }

  private get noResultsMessage() {
    const {noResultsMessage, query} = this.props;
    return (
      noResultsMessage &&
      query &&
      noResultsMessage.replace(
        query,
        `<strong class="${styles['NoResults-Query']}">${escape(
          query,
        )}</strong>`,
      )
    );
  }

  private get allSectionIds() {
    const {sections} = this.props;
    return sections.reduce((current, {name}) => [...current, name], []);
  }
}

export default StoreSwitcher;
