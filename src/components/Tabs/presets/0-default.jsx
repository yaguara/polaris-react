import React from 'react';
import Tabs from '../Tabs';

export default (
  <Tabs
    uxpId="tabs-1"
    tabs={[
      {id: 'tab1', content: 'First tab'},
      {id: 'tab2', content: 'Second Tab'},
    ]}
    selected={0}
  >
    Tabs content
  </Tabs>
);
