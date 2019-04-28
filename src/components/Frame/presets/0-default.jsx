import React from 'react';
import Frame from '../Frame';
import TopBar from '../../TopBar/TopBar';
import Navigation from '../../Navigation/Navigation';

const topBar = (
  <TopBar
    uxpId="frame-1.topbar-1"
    searchField={
      <TopBar.SearchField
        uxpId="frame-1.topbar-1.searchfield-1"
        value=""
        placeholder="Search"
      />
    }
    userMenu={
      <TopBar.UserMenu
        uxpId="frame-1.topbar-1.usermenu-1"
        name="Dharma"
        detail="Jaded Pixel"
        initials="D"
      />
    }
  />
);

const navigation = (
  <Navigation uxpId="frame-1.navigation-1" location="/">
    <Navigation.Section
      uxpId="frame-1.navigation-1.section-1"
      items={[{label: 'Back to Shopify'}]}
    />
    <Navigation.Section
      uxpId="frame-1.navigation-1.section-2"
      separator
      title="Jaded Pixel App"
      items={[{label: 'Dashboard'}]}
    />
  </Navigation>
);

export default (
  <Frame uxpId="frame-1" topBar={topBar} navigation={navigation}>
    {/**/}
  </Frame>
);
