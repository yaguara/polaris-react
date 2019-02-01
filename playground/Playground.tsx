import * as React from 'react';
import {Page, TopBar} from '../src';

interface State {}

export default class Playground extends React.Component<{}, State> {
  render() {
    return (
      <TopBar
        storeSwitcher={<TopBar.Menu action={[]} activatorContent="User" />}
      />
    );
  }
}
