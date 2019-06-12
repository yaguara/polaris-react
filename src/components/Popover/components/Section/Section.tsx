import * as React from 'react';
import styles from '../../Popover.scss';

export interface Props {
  children?: React.ReactNode;
}

/** @uxpinnamespace Popover */
export default function Section({children}: Props) {
  return <div className={styles.Section}>{children}</div>;
}
