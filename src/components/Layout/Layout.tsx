import React from 'react';
import {AnnotatedSection, Section} from './components';
import styles from './Layout.scss';
import {classNames} from '../../utilities/css';

export interface LayoutProps {
  /** Automatically adds sections to layout. */
  sectioned?: boolean;
  /** The content to display inside the layout. */
  children?: React.ReactNode;
}

export class Layout extends React.Component<LayoutProps, never> {
  static AnnotatedSection = AnnotatedSection;
  static Section = Section;

  render() {
    const {children, sectioned, className: extendedClasses = '', style } = this.props;

    const className = classNames(styles.Layout, ...extendedClasses);

    const content = sectioned ? <Section>{children}</Section> : children;

    return <div className={className} style={style}>{content}</div>;
  }
}
