import React from 'react';

import {ComplexAction, DisableableAction, LoadableAction} from '../../types';
import {Stack} from '../Stack';
import {ButtonGroup} from '../ButtonGroup';
import {buttonsFrom} from '../Button';

import styles from './PageActions.scss';
import {classNames} from '../../utilities/css';

export interface PageActionsProps {
  /** The primary action for the page */
  primaryAction?: DisableableAction & LoadableAction;
  /** The secondary actions for the page */
  secondaryActions?: ComplexAction[];
  className?: any;
  style?: any;
}

export function PageActions({
  primaryAction,
  secondaryActions,
  className: extendedClasses = '',
  style,
}: PageActionsProps) {
  const primaryActionMarkup = primaryAction
    ? buttonsFrom(primaryAction, {primary: true})
    : null;

  const secondaryActionsMarkup = secondaryActions ? (
    <ButtonGroup>{buttonsFrom(secondaryActions)}</ButtonGroup>
  ) : null;

  const distribution = secondaryActionsMarkup ? 'equalSpacing' : 'trailing';

  const className = classNames(styles.PageActions, ...extendedClasses.split(' '));

  return (
    <div className={className} style={style}>
      <Stack distribution={distribution} spacing="tight">
        {secondaryActionsMarkup}
        {primaryActionMarkup}
      </Stack>
    </div>
  );
}
