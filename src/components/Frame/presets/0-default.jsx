import React from 'react';
import Frame from '../Frame';

const topBar = `<TopBar
userMenu={\`<TopBar.UserMenu name="Dharma" detail="Jaded Pixel" initials="D" />\`}
searchField={\`<TopBar.SearchField value="" placeholder="Search" />\`}
/>`;

const navigation = `<Navigation location="/">
<Navigation.Section
  items={[{label: 'Back to Shopify'}]}
/>
<Navigation.Section
  separator
  title="Jaded Pixel App"
  items={[
    {label: 'Dashboard'},
  ]}
/>
</Navigation>`;

export default (
  <Frame uxpId="frame-1" topBar={topBar} navigation={navigation} />
);
