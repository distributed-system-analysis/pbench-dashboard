import React, { useEffect, Fragment, useState } from 'react';
import { Tree } from 'antd';
import _ from 'lodash';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import { Grid, GridItem } from '@patternfly/react-core';
import report1 from './report-1';
import report2 from './report-2';

const { DirectoryTree } = Tree;

const SystemComparisons = () => {
  const [globalHeirarchy, setGlobalHeirarchy] = useState([]);
  const [comparableFields, setComparableFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);

  const leafValues = [];

  // Should be a prop to this component.
  const selectedRecords = ['Metric Name', 'ip-192.168.0.1', 'ip-0.0.0.1'];

  const getIsolatedMetricTree = (currValues, currArr, metricName) => {
    // key -> "value" and state of the array.
    Object.keys(currValues).forEach(val => {
      if (typeof currValues[val] === 'object') {
        // More than one sub children.
        const temp = { title: val, key: `${metricName}-${val}`, children: [] };
        temp.children = getIsolatedMetricTree(
          currValues[val],
          temp.children,
          `${metricName}-${val}`
        );
        currArr.push(temp);
      } else {
        leafValues.push(`${metricName}-${val}`);
        currArr.push({
          title: val,
          key: `${metricName}-${val}`,
          value: currValues[val],
          isLeaf: true,
        });
      }
    });
    setSelectedFields(_.uniqBy(leafValues, el => el));
    return currArr;
  };

  const getHeirarchicalData = report => {
    const obj = [];
    // isolates a single report.
    Object.keys(report).forEach(metricName => {
      let heirarchy = {};
      // recurse here.
      if (typeof report[metricName] === 'object') {
        // Multiple fields inside the metric.
        heirarchy = { title: metricName, key: metricName, children: [] };
        heirarchy.children = getIsolatedMetricTree(
          report[metricName],
          heirarchy.children,
          metricName
        );
      } else {
        heirarchy = { title: metricName, key: metricName, value: null, isLeaf: true };
      }
      // We got the heirarchy, push it on to the obj
      // heirarchy is the tree data of each report.
      obj.push(heirarchy);
      // setSelectedFields(_.uniqBy([...selectedFields, ...leaves], (el) => el));
    });
    return obj;
  };

  const getGlobalHeirarchy = () => {
    const heirarchicalData = {};
    // loop over each selectedRecord
    // such as:
    // selectedRecords.forEach(recordName => {
    //   const data = getHeirarchicalData(recordName, getRecordData(recordName));
    // })
    const d1 = getHeirarchicalData(report1);
    const d2 = getHeirarchicalData(report2);
    heirarchicalData['ip-192.168.0.1'] = d1;
    heirarchicalData['ip-0.0.0.1'] = d2;
    return heirarchicalData;
  };

  const getFields = globalData => {
    let sidebarItems = [];
    Object.keys(globalData).forEach(system => {
      globalData[system].forEach(metric => {
        sidebarItems.push(metric);
      });
    });
    sidebarItems = _.uniqBy(sidebarItems, e => e.children.length && e.title);
    return sidebarItems;
  };

  // Given a heirarchical data, finds the value
  // that it holds, comparing various keys.
  const getValue = (fieldName, heirarchicalArr) => {
    if (heirarchicalArr.children) {
      return getValue(fieldName, heirarchicalArr.children);
    }
    let res = '';
    heirarchicalArr.forEach(el => {
      if (fieldName.startsWith(el.key) && fieldName !== el.key) {
        return getValue(fieldName, el.children);
      }
      if (fieldName === el.key) {
        // Maybe both the keys are equal
        res = el.value || '-';
      }
      return res;
    });
    return res;
  };

  // What to display in the table
  const getTableRows = fieldSelections => {
    if (fieldSelections.length === 0) {
      return [];
    }
    const rows = [];
    // build the rows here.
    // row -> { cells: [] }
    fieldSelections.forEach(field => {
      const tempObj = { cells: [] };
      tempObj.cells.push(field.split('-').pop());
      // Loop over the keys in globalHeirarchy
      Object.keys(globalHeirarchy).forEach(system => {
        // get's each system key, find the value and push
        // into the table.
        const fieldObj = _.find(globalHeirarchy[system], el => field.startsWith(el.key));
        let fieldVal = '';
        if (fieldObj.children) {
          // map exact objects to find the value
          fieldVal = getValue(field, fieldObj.children);
        } else fieldVal = fieldObj.value;
        // fieldVal holds the actual value for the queried field.
        tempObj.cells.push(fieldVal);
      });
      // Push into original rows.
      rows.push(tempObj);
    });
    return rows;
  };

  const onSelect = val => {
    setSelectedFields(val);
  };

  useEffect(() => {
    // probably pass reports here.
    const globalHeirarchicalData = getGlobalHeirarchy();
    const fields = getFields(globalHeirarchicalData);
    setGlobalHeirarchy(globalHeirarchicalData);
    setComparableFields(fields);
  }, []);

  return (
    <Fragment>
      <Grid>
        <GridItem span={2}>
          <DirectoryTree
            selectedKeys={selectedFields}
            showIcon={false}
            multiple
            defaultExpandAll
            onSelect={onSelect}
            // onExpand={onExpand}
            treeData={comparableFields}
          />
        </GridItem>
        <GridItem span={10}>
          <Table
            // onSelect={this.onSelect}
            // canSelectAll={canSelectAll}
            aria-label="Systems"
            cells={selectedRecords}
            rows={getTableRows(selectedFields)}
          >
            <TableHeader />
            <TableBody />
          </Table>
        </GridItem>
      </Grid>
    </Fragment>
  );
};

export default SystemComparisons;
