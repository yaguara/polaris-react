import * as React from 'react';
import Scrollable from '../../../Scrollable';
import Store, {StoreType} from '../Store';

export interface Props {
  stores: StoreType[];
  activeStoreUrl: string;
  highlight?: string;
}

function StoresList({stores, activeStoreUrl, highlight}: Props) {
  const storeNodes = stores.map(({name, url}) => (
    <Store
      key={url}
      name={name}
      highlight={highlight}
      url={url}
      active={url === activeStoreUrl}
    />
  ));

  return <Scrollable shadow>{storeNodes}</Scrollable>;
}

export default StoresList;
