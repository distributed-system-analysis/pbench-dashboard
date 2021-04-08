import React, { PureComponent } from 'react';
import { Link } from 'dva/router';
import { PageSidebar, Nav, NavList, NavItem } from '@patternfly/react-core';
import { menuData } from '../../common/menu';
import './index.less';

export default class NavigationDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.rootPages = menuData;
    this.state = {
      activeItem: props.location,
    };
  }

  onNavSelect = result => {
    this.setState({
      activeItem: result.itemId,
    });
  };

  render() {
    const { activeItem } = this.state;

    const PageNav = (
      <Nav onSelect={this.onNavSelect} theme="dark">
        <NavList>
          {this.rootPages.map(page => (
            <NavItem
              itemId={page.path}
              isActive={activeItem === page.path}
              key={page.path + page.name}
            >
              <Link to={page.path}>{page.name}</Link>
            </NavItem>
          ))}
        </NavList>
      </Nav>
    );

    return <PageSidebar nav={PageNav} theme="dark" />;
  }
}
