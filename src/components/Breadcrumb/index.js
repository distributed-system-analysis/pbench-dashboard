import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import styles from './index.less';

const RenderBreadcrumb = ({ context, dispatch }) => {
  const pathTo = route => {
    if (!route.parent) {
      return [route];
    }

    return [...pathTo(route.parent), route];
  };

  const navigateToCrumb = path => {
    dispatch(routerRedux.push(path));
  };

  return (
    <Breadcrumb>
      {pathTo(context).map((crumb, index, breadcrumbs) => (
        <BreadcrumbItem
          className={index < breadcrumbs.length - 1 ? styles.active : ''}
          key={crumb.path}
          onClick={() => navigateToCrumb(crumb.path)}
          isActive={index === breadcrumbs.length - 1}
        >
          {crumb.name}
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
};

export default connect()(RenderBreadcrumb);
