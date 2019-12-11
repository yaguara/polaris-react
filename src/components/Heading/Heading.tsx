import React from 'react';
import {HeadingTagName} from '../../types';
import styles from './Heading.scss';
import {classNames} from '../../utilities/css';

export interface HeadingProps {
  /**
   * The element name to use for the heading
   * @default 'h2'
   */
  element?: HeadingTagName;
  /** The content to display inside the heading */
  children?: React.ReactNode;
  className?: any;
  style?: any;
}

export function Heading({element: Element = 'h2', children, className: extendedClasses = '', style}: HeadingProps) {
  const className = classNames(styles.Heading, ...extendedClasses.split(' '));
  return <Element className={className} style={style}>{children}</Element>;
}
