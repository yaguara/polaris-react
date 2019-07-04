import React from 'react';
import EmptyState from '../EmptyState';

export default (
  <EmptyState
    uxpId="emptystate-1"
    heading="Empty state"
    action={{content: 'First action'}}
    secondaryAction={{content: 'Secondary action'}}
    image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
  >
    Empty state content
  </EmptyState>
);
