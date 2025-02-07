import React from 'react';
import {classNames, variationName} from '../../utilities/css';
import {HeadingTagName} from '../../types';
import styles from './DisplayText.scss';

export type Size = 'small' | 'medium' | 'large' | 'extraLarge';

export interface DisplayTextProps {
  /**
   * Name of element to use for text
   * @default 'p'
   */
  element?: HeadingTagName;
  /**
   * Size of the text
   * @default 'medium'
   */
  size?: Size;
  /** Content to display */
  children?: React.ReactNode;
  className?: any;
  style?: any;
}

export function DisplayText({
  element: Element = 'p',
  children,
  size = 'medium',
  className: extendedClasses = '',
  style,
}: DisplayTextProps) {
  const className = classNames(
    styles.DisplayText,
    size && styles[variationName('size', size)],
    ...extendedClasses.split(' '),
  );

  return <Element className={className} style={style}>{children}</Element>;
}
