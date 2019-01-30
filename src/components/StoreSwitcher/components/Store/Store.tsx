import * as React from 'react';
import {classNames} from '@shopify/react-utilities';
import UnstyledLink from '../../../UnstyledLink';
import {Store as StoreType} from '../../types';
import * as styles from './Store.scss';

export interface Props extends StoreType {
  active: boolean;
  highlight?: string;
}

function Store({name, url, active, highlight}: Props) {
  const storeClassNames = classNames(
    styles.Store,
    active && styles['Store-Active'],
  );

  const nameClassNames = classNames(
    styles.Name,
    highlight && styles['Name-Bolded'],
  );

  const nameMarkup = !highlight ? name : highlightName(name, highlight);

  return (
    <UnstyledLink url={url} className={storeClassNames}>
      <span
        className={nameClassNames}
        dangerouslySetInnerHTML={{__html: nameMarkup}}
      />
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

function highlightName(name: string, highlight: string) {
  return name.replace(
    new RegExp(highlight, 'i'),
    (match) => `<span class="${styles['Name-Highlight']}">${match}</span>`,
  );
}

export default Store;
