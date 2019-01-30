import * as React from 'react';
import {autobind} from '@shopify/javascript-utilities/decorators';
import {classNames} from '@shopify/react-utilities';
import Scrollable from '../../../Scrollable';
import Icon from '../../../Icon';
import {Section as SectionType} from '../../types';
import Store from '../Store';
import * as styles from './Section.scss';

export interface Props extends SectionType {
  id: string;
  activeStoreUrl: string;
  highlight?: string;
  open?: boolean;
  onClick(id: string): void;
}

class Section extends React.PureComponent<Props> {
  render() {
    const {name, stores, activeStoreUrl, open, highlight} = this.props;
    const className = classNames(styles.Header, open && styles['Header-Open']);
    let storesList;

    if (open) {
      const storeNodes = stores.map(({name, url}) => (
        <Store
          key={url}
          name={name}
          highlight={highlight}
          url={url}
          active={url === activeStoreUrl}
        />
      ));

      storesList = open && <Scrollable shadow>{storeNodes}</Scrollable>;
    }

    return (
      <>
        <div className={className} onClick={this.handleClick}>
          {name}
          <div className={styles['Header-Icon']}>
            <Icon source="chevronDown" color="inkLighter" />
          </div>
        </div>
        {storesList}
      </>
    );
  }

  @autobind
  private handleClick() {
    const {onClick, id} = this.props;
    onClick(id);
  }
}

export default Section;
