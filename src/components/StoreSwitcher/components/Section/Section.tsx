import * as React from 'react';
import {autobind} from '@shopify/javascript-utilities/decorators';
import {classNames} from '@shopify/react-utilities';
import Icon from '../../../Icon';
import * as styles from './Section.scss';

export interface Props {
  id: string;
  name: string;
  onClick(id: string): void;
  children: React.ReactNode;
  open?: boolean;
}

class Section extends React.PureComponent<Props> {
  render() {
    const {name, open, children} = this.props;
    const className = classNames(styles.Header, open && styles['Header-Open']);

    return (
      <>
        <div className={className} onClick={this.handleClick}>
          {name}
          <div className={styles['Header-Icon']}>
            <Icon source="chevronDown" color="inkLighter" />
          </div>
        </div>
        {open && children}
      </>
    );
  }

  @autobind
  private handleClick() {
    const {id, onClick} = this.props;
    onClick(id);
  }
}

export default Section;
