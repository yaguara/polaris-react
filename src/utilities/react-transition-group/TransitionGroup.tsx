import React, {ReactType, ReactElement} from 'react';
import TransitionGroupContext from './TransitionGroupContext';
import {TransitionActions, Props as TransitionProps} from './Transition';

import {
  getChildMapping,
  getInitialChildMapping,
  getNextChildMapping,
} from './utils/ChildMapping';

const values =
  Object.values || ((obj: any) => Object.keys(obj).map((key) => obj[key]));

const defaultProps = {
  component: 'div',
  childFactory: (child: ReactElement) => child,
};

interface IntrinsicTransitionGroupProps<
  T extends keyof JSX.IntrinsicElements = 'div'
> extends TransitionActions {
  component?: T | null;
}

interface ComponentTransitionGroupProps<T extends ReactType>
  extends TransitionActions {
  component: T;
}

type Props<
  T extends keyof JSX.IntrinsicElements = 'div',
  V extends ReactType = any
> =
  | (IntrinsicTransitionGroupProps<T> & JSX.IntrinsicElements[T])
  | (ComponentTransitionGroupProps<V>) & {
      children?:
        | ReactElement<TransitionProps>
        | Array<ReactElement<TransitionProps>>;
      childFactory?(child: ReactElement): ReactElement;
      [prop: string]: any;
    };

interface State {
  contextValue: any;
  handleExited: any;
  firstRender: any;
  children?: any;
}

class TransitionGroup extends React.Component<Props, State> {
  static defaultProps = defaultProps;

  static getDerivedStateFromProps(
    nextProps: Props,
    {children: prevChildMapping, handleExited, firstRender}: State,
  ) {
    return {
      children: firstRender
        ? getInitialChildMapping(nextProps, handleExited)
        : getNextChildMapping(nextProps, prevChildMapping, handleExited),
      firstRender: false,
    };
  }

  private mounted: boolean;

  constructor(props: Props, context: any) {
    super(props, context);

    const handleExited = this.handleExited.bind(this);

    // Initial children should all be entering, dependent on appear
    this.state = {
      contextValue: {isMounting: true},
      // eslint-disable-next-line react/no-unused-state
      handleExited,
      // eslint-disable-next-line react/no-unused-state
      firstRender: true,
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.setState({
      contextValue: {isMounting: false},
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleExited(child: ReactElement, node: HTMLElement) {
    const currentChildMapping = getChildMapping(this.props.children);

    if ((child as any).key in currentChildMapping) return;

    if (child.props.onExited) {
      child.props.onExited(node);
    }

    if (this.mounted) {
      this.setState((state) => {
        const children = {...state.children};

        delete children[(child as any).key];
        return {children};
      });
    }
  }

  render() {
    const {component: Component, childFactory, ...props} = this
      .props as Props & {childFactory: (child: ReactElement) => ReactElement};
    const {contextValue} = this.state;
    const children = values(this.state.children).map(childFactory);

    delete props.appear;
    delete props.enter;
    delete props.exit;

    if (Component === null) {
      return (
        <TransitionGroupContext.Provider value={contextValue}>
          {children}
        </TransitionGroupContext.Provider>
      );
    }
    return (
      <TransitionGroupContext.Provider value={contextValue}>
        <Component {...props}>{children}</Component>
      </TransitionGroupContext.Provider>
    );
  }
}

export default TransitionGroup;
