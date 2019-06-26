import React from 'react';
import Transition, {Props as TransitionProps} from './Transition';

const addClass = (node: HTMLElement, classes: string) =>
  node &&
  classes &&
  classes.split(' ').forEach((className) => node.classList.add(className));

const removeClass = (node: HTMLElement, classes: string) =>
  node &&
  classes &&
  classes.split(' ').forEach((className) => node.classList.remove(className));

interface CSSTransitionClassNames {
  appear?: string;
  appearActive?: string;
  appearDone?: string;
  enter?: string;
  enterActive?: string;
  enterDone?: string;
  exit?: string;
  exitActive?: string;
  exitDone?: string;
}

interface Props extends TransitionProps {
  classNames?: string | CSSTransitionClassNames;
}

class CSSTransition extends React.Component<Props, never> {
  static defaultProps = {
    classNames: '',
  };

  appliedClasses: any = {
    appear: {},
    enter: {},
    exit: {},
  };

  onEnter = (node: HTMLElement, appearing: boolean) => {
    this.removeClasses(node, 'exit');
    this.addClass(node, appearing ? 'appear' : 'enter', 'base');

    if (this.props.onEnter) {
      this.props.onEnter(node, appearing);
    }
  };

  onEntering = (node: HTMLElement, appearing: boolean) => {
    const type = appearing ? 'appear' : 'enter';
    this.addClass(node, type, 'active');

    if (this.props.onEntering) {
      this.props.onEntering(node, appearing);
    }
  };

  onEntered = (node: HTMLElement, appearing: boolean) => {
    const type = appearing ? 'appear' : 'enter';
    this.removeClasses(node, type);
    this.addClass(node, type, 'done');

    if (this.props.onEntered) {
      this.props.onEntered(node, appearing);
    }
  };

  onExit = (node: HTMLElement) => {
    this.removeClasses(node, 'appear');
    this.removeClasses(node, 'enter');
    this.addClass(node, 'exit', 'base');

    if (this.props.onExit) {
      this.props.onExit(node);
    }
  };

  onExiting = (node: HTMLElement) => {
    this.addClass(node, 'exit', 'active');

    if (this.props.onExiting) {
      this.props.onExiting(node);
    }
  };

  onExited = (node: HTMLElement) => {
    this.removeClasses(node, 'exit');
    this.addClass(node, 'exit', 'done');

    if (this.props.onExited) {
      this.props.onExited(node);
    }
  };

  getClassNames = (type: string): any => {
    const {classNames} = this.props;
    const isStringClassNames = typeof classNames === 'string';
    const prefix = isStringClassNames && classNames ? `${classNames}-` : '';

    const baseClassName = isStringClassNames
      ? `${prefix}${type}`
      : (classNames as any)[type];

    const activeClassName = isStringClassNames
      ? `${baseClassName}-active`
      : (classNames as any)[`${type}Active`];

    const doneClassName = isStringClassNames
      ? `${baseClassName}-done`
      : (classNames as any)[`${type}Done`];

    return {
      baseClassName,
      activeClassName,
      doneClassName,
    };
  };

  addClass(node: HTMLElement, type: string, phase: string) {
    let className = this.getClassNames(type)[`${phase}ClassName`];

    if (type === 'appear' && phase === 'done') {
      className += ` ${this.getClassNames('enter').doneClassName}`;
    }

    // This is for to force a repaint,
    // which is necessary in order to transition styles when adding a class name.
    if (phase === 'active') {
      node && node.scrollTop;
    }

    this.appliedClasses[type][phase] = className;
    addClass(node, className);
  }

  removeClasses(node: HTMLElement, type: string) {
    const {
      base: baseClassName,
      active: activeClassName,
      done: doneClassName,
    } = this.appliedClasses[type];

    this.appliedClasses[type] = {};

    if (baseClassName) {
      removeClass(node, baseClassName);
    }
    if (activeClassName) {
      removeClass(node, activeClassName);
    }
    if (doneClassName) {
      removeClass(node, doneClassName);
    }
  }

  render() {
    const {classNames: _, ...props} = this.props;

    return (
      <Transition
        {...props}
        onEnter={this.onEnter}
        onEntered={this.onEntered}
        onEntering={this.onEntering}
        onExit={this.onExit}
        onExiting={this.onExiting}
        onExited={this.onExited}
      />
    );
  }
}

export default CSSTransition;
