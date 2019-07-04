import React from 'react';
import Navigation from '../Navigation';

export default (
  <Navigation uxpId="navigation-1" location="/">
    <Navigation.Section
      uxpId="navigation-1.section-1"
      items={[{label: 'Back to Shopify'}]}
    />
    <Navigation.Section
      uxpId="navigation-1.section-2"
      separator
      title="Section title"
      items={[{label: 'First item'}]}
    />
  </Navigation>
);
