import React from 'react';
import {HeadingTagName} from '../../types';
import styles from './Subheading.scss';
import {classNames} from '../../utilities/css';

export interface SubheadingProps {
  /**
   * The element name to use for the subheading
   * @default 'h3'
   */
  element?: HeadingTagName;
  /** Text to display in subheading */
  children?: React.ReactNode;
  className?: any;
  style?: any;
}

export function Subheading({
  element: Element = 'h3',
  children,
  className: extendedClasses = '',
  style,
}: SubheadingProps) {
  const ariaLabel = typeof children === 'string' ? children : undefined;
  const className = classNames(styles.Subheading, ...extendedClasses);
  return (
    <Element aria-label={ariaLabel} className={className} style={style}>
      {children}
    </Element>
  );
}
