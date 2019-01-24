import * as React from 'react';

import Scrollable from '../Scrollable';

import {UserMenu, Section, Item, StoreSwitcher} from './components';
import {contextTypes, SectionType} from './types';

import * as styles from './Navigation.scss';

export interface Props {
  location: string;
  sections?: SectionType[];
  children?: React.ReactNode;
  userMenu?: React.ReactNode;
  storeSwitcher?: React.ReactNode;
  onDismiss?(): void;
}

export default class Navigation extends React.Component<Props, never> {
  static Item = Item;
  static UserMenu = UserMenu;
  static StoreSwitcher = StoreSwitcher;
  static Section = Section;
  static childContextTypes = contextTypes;

  getChildContext() {
    return {
      location: this.props.location,
      onNavigationDismiss: this.props.onDismiss,
    };
  }

  render() {
    const {children, userMenu, storeSwitcher} = this.props;

    const storeSwitcherMarkup = storeSwitcher && (
      <div className={styles.Menu}>{storeSwitcher}</div>
    );

    return (
      <nav className={styles.Navigation}>
        {userMenu}
        {storeSwitcherMarkup}
        <Scrollable className={styles.PrimaryNavigation}>{children}</Scrollable>
      </nav>
    );
  }
}
