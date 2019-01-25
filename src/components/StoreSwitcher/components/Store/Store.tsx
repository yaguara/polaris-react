import * as React from 'react';
import {classNames} from '@shopify/react-utilities';
import UnstyledLink from '../../../UnstyledLink';
import {Store as StoreType} from '../../types';
import * as styles from './Store.scss';

export interface Props extends StoreType {
  active: boolean;
}

function Store({name, url, active}: Props) {
  const storeClassNames = classNames(
    styles.Store,
    active && styles['Store-Active'],
  );

  return (
    <UnstyledLink url={url} className={storeClassNames}>
      <span className={styles.Name}>{name}</span>
      <span className={styles.Url}>{cleanUrl(url)}</span>
    </UnstyledLink>
  );
}

function cleanUrl(url: string) {
  try {
    // eslint-disable-next-line node/no-unsupported-features/node-builtins
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export default Store;
