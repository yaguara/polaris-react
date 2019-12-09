import React from 'react';
import {classNames} from '../../../../utilities/css';
import {SearchDismissOverlay} from '../SearchDismissOverlay';
import styles from './Search.scss';

export interface SearchProps {
  /** Toggles whether or not the search is visible */
  visible?: boolean;
  /** The content to display inside the search */
  children?: React.ReactNode;
  /** Callback when the search is dismissed */
  onDismiss?(): void;
}

export function Search({visible, children, onDismiss}: SearchProps) {
  if (children == null) {
    return null;
  }

  return (
    <div className={classNames(styles.Search, visible && styles.visible)}>
      <SearchDismissOverlay onDismiss={onDismiss} />
      <div className={styles.Results}>{children}</div>
    </div>
  );
}
