import React, { useState, useEffect, Fragment } from 'react';
import { getFullPathMap } from '@/utils/utils';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import styles from './index.less';

const RenderBreadcrumb = ({ context, dispatch, currLocation }) => {
  const [breadcrumbsArr, setBreadcrumbsArr] = useState([]);
  useEffect(
    () => {
      // breaks the string into array of items.
      // populates the breadcrumbsArr.
      const crumbs = getFullPathMap(context);
      setBreadcrumbsArr(crumbs);
    },
    [context]
  );

  const navigateToCrumb = path => {
    dispatch(routerRedux.push(path));
  };

  return (
    <Fragment>
      <Breadcrumb>
        {breadcrumbsArr.map(item => (
          <BreadcrumbItem
            key={item.path}
            className={currLocation === item.path ? styles.inactive : styles.active}
            onClick={() => navigateToCrumb(item.path)}
          >
            {item.name}
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    </Fragment>
  );
};

export default connect()(RenderBreadcrumb);
