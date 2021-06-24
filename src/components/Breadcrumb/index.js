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
      {pathTo(context).map((crumb, index, breadcrumbs) => {
        return (
          <>
            {index < breadcrumbs.length - 1 && (
              <BreadcrumbItem
                className={styles.active}
                key={crumb.path}
                onClick={() => navigateToCrumb(crumb.path)}
              >
                {crumb.name}
              </BreadcrumbItem>
            )}
            {index === breadcrumbs.length - 1 && (
              <BreadcrumbItem key={crumb.path} isActive>
                {crumb.name}
              </BreadcrumbItem>
            )}
          </>
        );
      })}
    </Breadcrumb>
  );
};

export default connect()(RenderBreadcrumb);
