import * as React from 'react';
import Page from '../Page';

export default (
  <Page
    uxpId="page-1"
    title="Page title"
    breadcrumbs={[{content: 'Previous'}]}
    primaryAction={{content: 'Primary Action'}}
  />
);
