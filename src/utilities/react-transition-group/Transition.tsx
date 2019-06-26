import React from 'react';
import {findDOMNode} from 'react-dom';

import TransitionGroupContext from './TransitionGroupContext';

export const UNMOUNTED = 'unmounted';
export const EXITED = 'exited';
export const ENTERING = 'entering';
export const ENTERED = 'entered';
export const EXITING = 'exiting';

const config = {
  disabled: false,
};

export type TransitionStatus =
  | typeof ENTERING
  | typeof ENTERED
  | typeof EXITING
  | typeof EXITED
  | typeof UNMOUNTED;
export type EndHandler = (node: HTMLElement, done: () => void) => void;
export type EnterHandler = (node: HTMLElement, isAppearing?: boolean) => void;
export type ExitHandler = (node: HTMLElement) => void;
export type TransitionChildren =
  | React.ReactNode
  | ((status: TransitionStatus, childProps: any) => React.ReactNode);

export interface TransitionActions {
  appear?: boolean;
  enter?: boolean;
  exit?: boolean;
}

export interface Props extends TransitionActions {
  node: HTMLElement | null;
  in?: boolean;
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
  timeout: number | {appear?: number; enter?: number; exit?: number};
  addEndListener?: EndHandler;
  onEnter?: EnterHandler;
  onEntering?: EnterHandler;
  onEntered?: EnterHandler;
  onExit?: ExitHandler;
  onExiting?: ExitHandler;
  onExited?: ExitHandler;
  children?: TransitionChildren;
  [prop: string]: any;
}

interface State {
  status: any;
  in?: boolean;
}

class Transition extends React.Component<Props, State> {
  static contextType = TransitionGroupContext;
  static UNMOUNTED = 0;
  static EXITED = 1;
  static ENTERING = 2;
  static ENTERED = 3;
  static EXITING = 4;
  static defaultProps = {
    in: false,
    mountOnEnter: false,
    unmountOnExit: false,
    appear: false,
    enter: true,
    exit: true,

    onEnter: noop,
    onEntering: noop,
    onEntered: noop,

    onExit: noop,
    onExiting: noop,
    onExited: noop,
  };

  static getDerivedStateFromProps({in: nextIn}: State, prevState: State) {
    if (nextIn && prevState.status === UNMOUNTED) {
      return {status: EXITED};
    }
    return null;
  }

  private appearStatus: null | TransitionStatus;
  private nextCallback: null | any;

  constructor(props: Props, context: any) {
    super(props, context);

    const parentGroup = context;
    // In the context of a TransitionGroup all enters are really appears
    const appear =
      parentGroup && !parentGroup.isMounting ? props.enter : props.appear;

    let initialStatus;

    this.appearStatus = null;

    if (props.in) {
      if (appear) {
        initialStatus = EXITED;
        this.appearStatus = ENTERING;
      } else {
        initialStatus = ENTERED;
      }
    } else if (props.unmountOnExit || props.mountOnEnter) {
      initialStatus = UNMOUNTED;
    } else {
      initialStatus = EXITED;
    }

    this.state = {status: initialStatus};

    this.nextCallback = null;
  }

  componentDidMount() {
    this.updateStatus(true, this.appearStatus);
  }

  componentDidUpdate(prevProps: Props) {
    let nextStatus = null;
    if (prevProps !== this.props) {
      const {status} = this.state;

      if (this.props.in) {
        if (status !== ENTERING && status !== ENTERED) {
          nextStatus = ENTERING;
        }
      } else if (status === ENTERING || status === ENTERED) {
        nextStatus = EXITING;
      }
    }
    this.updateStatus(false, nextStatus);
  }

  componentWillUnmount() {
    this.cancelNextCallback();
  }

  getTimeouts() {
    const {timeout} = this.props;
    let exit;
    let enter;
    let appear;

    // eslint-disable-next-line no-multi-assign
    exit = enter = appear = timeout;

    if (timeout != null && typeof timeout !== 'number') {
      exit = timeout.exit;
      enter = timeout.enter;
      // TODO: remove fallback for next major
      appear = timeout.appear !== undefined ? timeout.appear : enter;
    }
    return {exit, enter, appear};
  }

  updateStatus(mounting = false, nextStatus: TransitionStatus | null | string) {
    if (nextStatus !== null) {
      // nextStatus will always be ENTERING or EXITING.
      this.cancelNextCallback();
      const node = this.props.node || findDOMNode(this);

      if (nextStatus === ENTERING) {
        this.performEnter(node as any, mounting);
      } else {
        this.performExit(node as any);
      }
    } else if (this.props.unmountOnExit && this.state.status === EXITED) {
      this.setState({status: UNMOUNTED});
    }
  }

  performEnter(node: HTMLElement, mounting: boolean) {
    const {enter} = this.props;
    const appearing = this.context ? this.context.isMounting : mounting;

    const timeouts = this.getTimeouts();
    const enterTimeout = appearing ? timeouts.appear : timeouts.enter;
    // no enter animation skip right to ENTERED
    // if we are mounting and running this it means appear _must_ be set
    if ((!mounting && !enter) || config.disabled) {
      this.safeSetState({status: ENTERED}, () => {
        this.props.onEntered && this.props.onEntered(node);
      });
      return;
    }

    this.props.onEnter && this.props.onEnter(node, appearing);

    this.safeSetState({status: ENTERING}, () => {
      this.props.onEntering && this.props.onEntering(node, appearing);

      this.onTransitionEnd(node, enterTimeout, () => {
        this.safeSetState({status: ENTERED}, () => {
          this.props.onEntered && this.props.onEntered(node, appearing);
        });
      });
    });
  }

  performExit(node: HTMLElement) {
    const {exit} = this.props;
    const timeouts = this.getTimeouts();

    // no exit animation skip right to EXITED
    if (!exit || config.disabled) {
      this.safeSetState({status: EXITED}, () => {
        this.props.onExited && this.props.onExited(node);
      });
      return;
    }
    this.props.onExit && this.props.onExit(node);

    this.safeSetState({status: EXITING}, () => {
      this.props.onExiting && this.props.onExiting(node);

      this.onTransitionEnd(node, timeouts.exit, () => {
        this.safeSetState({status: EXITED}, () => {
          this.props.onExited && this.props.onExited(node);
        });
      });
    });
  }

  cancelNextCallback() {
    if (this.nextCallback !== null) {
      this.nextCallback.cancel();
      this.nextCallback = null;
    }
  }

  safeSetState(nextState: State, callback: () => void) {
    // This shouldn't be necessary, but there are weird race conditions with
    // setState callbacks and unmounting in testing, so always make sure that
    // we can cancel any pending setState callbacks after we unmount.
    (callback as any) = this.setNextCallback(callback);
    this.setState(nextState, callback);
  }

  setNextCallback(callback: any) {
    let active = true;

    this.nextCallback = (event: any) => {
      if (active) {
        active = false;
        this.nextCallback = null;

        // eslint-disable-next-line callback-return
        callback(event);
      }
    };

    this.nextCallback.cancel = () => {
      active = false;
    };

    return this.nextCallback;
  }

  onTransitionEnd(node: HTMLElement, timeout: any, handler: any) {
    this.setNextCallback(handler);

    const doesNotHaveTimeoutOrListener =
      timeout == null && !this.props.addEndListener;
    if (!node || doesNotHaveTimeoutOrListener) {
      setTimeout(this.nextCallback, 0);
      return;
    }

    if (this.props.addEndListener) {
      this.props.addEndListener(node, this.nextCallback);
    }

    if (timeout != null) {
      setTimeout(this.nextCallback, timeout);
    }
  }

  render() {
    const status = this.state.status;
    if (status === UNMOUNTED) {
      return null;
    }

    const {children, ...childProps} = this.props;
    // filter props for Transtition
    delete childProps.in;
    delete childProps.mountOnEnter;
    delete childProps.unmountOnExit;
    delete childProps.appear;
    delete childProps.enter;
    delete childProps.exit;
    delete childProps.timeout;
    delete childProps.addEndListener;
    delete childProps.onEnter;
    delete childProps.onEntering;
    delete childProps.onEntered;
    delete childProps.onExit;
    delete childProps.onExiting;
    delete childProps.onExited;

    if (isFunction(children)) {
      // allows for nested Transitions
      return (
        <TransitionGroupContext.Provider value={null}>
          {children(status, childProps)}
        </TransitionGroupContext.Provider>
      );
    }

    const child = React.Children.only(children);
    return (
      // allows for nested Transitions
      <TransitionGroupContext.Provider value={null}>
        {React.cloneElement(child as any, childProps)}
      </TransitionGroupContext.Provider>
    );
  }
}

// Name the function so it is clearer in the documentation
function noop() {}

function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

export default Transition;
