import React, {useCallback, useRef} from 'react';
import * as styles from './SearchDismissOverlay.scss';

interface Props {
  /** Callback when the search is dismissed */
  onDismiss?(): void;
}

export function SearchDismissOverlay({onDismiss = noop}: Props) {
  const node = useRef(null);

  const handleDismiss = useCallback(
    ({target}: React.MouseEvent<HTMLElement>) => {
      if (target === node.current) {
        onDismiss();
      }
    },
    [onDismiss],
  );

  return (
    <div
      ref={node}
      className={styles.SearchDismissOverlay}
      onClick={handleDismiss}
    />
  );
}

function noop() {}
