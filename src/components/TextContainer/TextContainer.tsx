import React from 'react';
import {classNames, variationName} from '../../utilities/css';

import styles from './TextContainer.scss';

export type Spacing = 'tight' | 'loose';

export interface TextContainerProps {
  /** The amount of vertical spacing children will get between them */
  spacing?: Spacing;
  /** The content to render in the text container. */
  children?: React.ReactNode;
  className?: any;
  style?: any;
}

export function TextContainer({spacing, children, className: extendedClasses = '', style,}: TextContainerProps) {
  const className = classNames(
    styles.TextContainer,
    spacing && styles[variationName('spacing', spacing)],
    ...extendedClasses
  );
  return <div className={className} style={style}>{children}</div>;
}
