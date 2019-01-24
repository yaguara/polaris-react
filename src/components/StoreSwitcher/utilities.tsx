import * as React from 'react';
import TextStyle from '../TextStyle';
import {Store} from './types';
import * as styles from './StoreSwitcher.scss';

export function transformStoresToItems(stores: Store[], activeIndex: number) {
  return stores.map(({name, url}, index) => ({
    content: (
      <div className={styles.StoreItem}>
        <div className={styles.StoreName}>{name}</div>
        <div className={styles.StoreUrl}>
          <TextStyle variation="subdued">{cleanUrl(url)}</TextStyle>
        </div>
      </div>
    ) as any,
    url,
    active: index === activeIndex,
  }));
}

export function filterStores(query: string, stores: Store[]) {
  const lowerQuery = query.toLowerCase();
  const newStores = stores.filter(
    ({name, url}) =>
      name.toLowerCase().startsWith(lowerQuery) ||
      cleanUrl(url).startsWith(lowerQuery),
  );
  return newStores;
}

function cleanUrl(url: string) {
  try {
    // eslint-disable-next-line node/no-unsupported-features/node-builtins
    return new URL(url).hostname;
  } catch {
    return url;
  }
}
