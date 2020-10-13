import React, { PureComponent } from 'react';
import { Link } from 'dva/router';
import { PageSidebar, Nav, NavList, NavItem } from '@patternfly/react-core';
import getMenuData from '../../common/menu';

export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.rootPages = getMenuData();
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
            <NavItem itemId={page.path} isActive={activeItem === page.path}>
              <Link to={page.path}>{page.name}</Link>
            </NavItem>
          ))}
        </NavList>
      </Nav>
    );

    return <PageSidebar nav={PageNav} theme="dark" />;
  }
}
