import React from 'react';
import {classNames, variationName} from '../../utilities/css';
import {elementChildren, wrapWithComponent} from '../../utilities/components';

import {Item} from './components';
import styles from './Stack.scss';

export type Spacing = 'extraTight' | 'tight' | 'loose' | 'extraLoose' | 'none';

export type Alignment = 'leading' | 'trailing' | 'center' | 'fill' | 'baseline';

export type Distribution =
  | 'equalSpacing'
  | 'leading'
  | 'trailing'
  | 'center'
  | 'fill'
  | 'fillEvenly';

export interface StackProps {
  /** Elements to display inside stack */
  children?: React.ReactNode;
  /** Wrap stack elements to additional rows as needed on small screens (Defaults to true) */
  wrap?: boolean;
  /** Stack the elements vertically */
  vertical?: boolean;
  /** Adjust spacing between elements */
  spacing?: Spacing;
  /** Adjust vertical alignment of elements */
  alignment?: Alignment;
  /** Adjust horizontal alignment of elements */
  distribution?: Distribution;
  className?: any;
  style?: any;
}

export class Stack extends React.PureComponent<StackProps, never> {
  static Item = Item;

  render() {
    const {
      children,
      vertical,
      spacing,
      distribution,
      alignment,
      wrap,
      className: extendedClasses = '',
      style,
    } = this.props;

    const className = classNames(
      styles.Stack,
      vertical && styles.vertical,
      spacing && styles[variationName('spacing', spacing)],
      distribution && styles[variationName('distribution', distribution)],
      alignment && styles[variationName('alignment', alignment)],
      wrap === false && styles.noWrap,
      ...extendedClasses.split(' '),
    );

    const itemMarkup = elementChildren(children).map((child, index) => {
      const props = {key: index};
      return wrapWithComponent(child, Item, props);
    });

    return <div className={className} style={style}>{itemMarkup}</div>;
  }
}
