import React, { Component } from 'react';
import { Spin } from 'antd';
import {
  Form,
  Flex,
  FlexItem,
  PageSection,
  PageSectionVariants,
  Divider,
  Card,
  CardBody,
} from '@patternfly/react-core';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import _ from 'lodash';

import Button from '@/components/Button';
import Table from '@/components/Table';
import SearchBar from '@/components/SearchBar';
import Select from '@/components/Select';
import AntdDatePicker from '@/components/DatePicker';

@connect(({ search, global, datastore, loading }) => ({
  mapping: search.mapping,
  searchResults: search.searchResults,
  fields: search.fields,
  selectedFields: global.selectedFields,
  selectedDateRange: global.selectedDateRange,
  selectedResults: global.selectedResults,
  indices: datastore.indices,
  loadingMapping: loading.effects['search/fetchIndexMapping'],
  loadingSearchResults: loading.effects['search/fetchSearchResults'],
}))
class SearchList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: '',
      updateFiltersDisabled: true,
      selectedRuns: [],
    };
  }

  componentDidMount() {
    const { indices, mapping, selectedDateRange } = this.props;

    if (
      indices.length === 0 ||
      Object.keys(mapping).length === 0 ||
      selectedDateRange.start === '' ||
      selectedDateRange.end === ''
    ) {
      this.fetchMonthIndices();
    }
  }

  componentDidUpdate(prevProps) {
    const { selectedResults, selectedDateRange, selectedFields } = this.props;

    if (prevProps.selectedResults !== selectedResults) {
      this.setState({ selectedRuns: selectedResults });
    }
    if (
      prevProps.selectedDateRange !== selectedDateRange ||
      prevProps.selectedFields !== selectedFields
    ) {
      this.setState({ updateFiltersDisabled: false });
    }
  }

  fetchMonthIndices = async () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'datastore/fetchMonthIndices',
    }).then(() => {
      this.fetchIndexMapping();
    });
  };

  fetchIndexMapping = () => {
    const { dispatch, indices } = this.props;

    dispatch({
      type: 'search/fetchIndexMapping',
      payload: {
        indices,
      },
    });
  };

  onRemoveRun = selectedRowData => {
    let { selectedRuns } = this.state;

    selectedRuns = selectedRuns.filter(run => {
      if (run.key === selectedRowData.key) {
        return false;
      }
      return true;
    });

    this.setState({ selectedRuns });
  };

  onSelectChange = selectedRowData => {
    let { selectedRuns } = this.state;

    selectedRuns = [...selectedRuns, ...selectedRowData];
    selectedRuns = _.uniqBy(selectedRuns, 'key');

    this.setState({ selectedRuns });
  };

  resetSelectedFields = async () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'global/updateSelectedFields',
      payload: ['run.name', 'run.config', 'run.controller', '@metadata.controller_dir'],
    });
  };

  updateSelectedFields = field => {
    const { dispatch, selectedFields } = this.props;
    const newSelectedFields = selectedFields.slice();

    if (newSelectedFields.includes(field)) {
      newSelectedFields.splice(newSelectedFields.indexOf(field), 1);
    } else {
      newSelectedFields.push(field);
    }

    dispatch({
      type: 'global/updateSelectedFields',
      payload: newSelectedFields,
    });
    this.setState({ updateFiltersDisabled: false });
  };

  updateSearchQuery = e => {
    this.setState({ searchQuery: e.target.value });
  };

  commitRunSelections = async () => {
    const { selectedRuns } = this.state;
    const { dispatch } = this.props;

    const selectedControllers = new Set([]);
    selectedRuns.forEach(run => {
      const controller = run['run.controller'];
      selectedControllers.add(controller);
    });

    dispatch({
      type: 'global/updateSelectedResults',
      payload: selectedRuns,
    });
    dispatch({
      type: 'global/updateSelectedControllers',
      payload: [...selectedControllers],
    });
  };

  fetchSearchQuery = () => {
    const { searchQuery } = this.state;
    const { dispatch, selectedFields, selectedDateRange } = this.props;

    this.commitRunSelections().then(() => {
      dispatch({
        type: 'search/fetchSearchResults',
        payload: {
          selectedDateRange,
          selectedFields,
          query: searchQuery,
        },
      });
      this.setState({ updateFiltersDisabled: true });
    });
  };

  retrieveResults = selectedResults => {
    const { dispatch } = this.props;

    dispatch({
      type: 'global/updateSelectedControllers',
      payload: [selectedResults[0]['run.controller']],
    }).then(() => {
      dispatch({
        type: 'global/updateSelectedResults',
        payload: selectedResults,
      }).then(() => {
        dispatch(
          routerRedux.push({
            pathname: '/summary',
          })
        );
      });
    });
  };

  compareResults = selectedRows => {
    const { dispatch } = this.props;

    dispatch({
      type: 'global/updateSelectedResults',
      payload: selectedRows.map(row => row.original.result),
    });

    this.commitRunSelections().then(() => {
      dispatch(
        routerRedux.push({
          pathname: '/comparison-select',
        })
      );
    });
  };

  render() {
    const { updateFiltersDisabled } = this.state;
    const {
      mapping,
      selectedFields,
      searchResults,
      loadingSearchResults,
      loadingMapping,
    } = this.props;
    const columns = [];

    selectedFields.forEach(field => {
      columns.push({
        Header: field,
        accessor: field,
      });
    });

    return (
      <React.Fragment>
        <PageSection variant={PageSectionVariants.light}>
          <div>
            <SearchBar
              style={{ marginRight: 32, marginBottom: 16 }}
              placeholder="Search runs"
              onSearch={this.fetchSearchQuery}
            />
            <Spin spinning={loadingMapping}>
              <Form
                style={{
                  padding: '24px',
                  backgroundColor: '#FAFAFA',
                  border: '1px solid #D9D9D9',
                  borderRadius: '6px',
                }}
              >
                <Flex>
                  <FlexItem style={{ marginRight: 16, marginBottom: 16 }}>
                    <p style={{ marginBottom: 6, fontSize: 12, fontWeight: 600 }}>months</p>
                    <AntdDatePicker />
                  </FlexItem>
                  {Object.keys(mapping).map(field => (
                    <FlexItem key={field} style={{ marginRight: 16, marginBottom: 16 }}>
                      <p style={{ marginBottom: 4, fontSize: 12, fontWeight: 600 }}>{field}</p>
                      <Select
                        key={field}
                        selected={selectedFields.filter(item => {
                          return item.split('.')[0] === field;
                        })}
                        options={mapping[field].map(item => {
                          return item;
                        })}
                        onSelect={(event, value) => this.updateSelectedFields(`${field}.${value}`)}
                      />
                    </FlexItem>
                  ))}
                </Flex>
                <div style={{ textAlign: 'right' }}>
                  <Button
                    type="primary"
                    name="Filter"
                    disabled={updateFiltersDisabled}
                    onClick={e => {
                      // prevent form submit
                      // from reloading the page.
                      e.preventDefault();
                      this.fetchSearchQuery();
                    }}
                  />
                  <Button
                    type="secondary"
                    style={{ marginLeft: 8 }}
                    onClick={this.resetSelectedFields}
                    name="Reset"
                  />
                </div>
              </Form>
            </Spin>
          </div>
        </PageSection>
        <Divider component="div" />
        <PageSection>
          <Card>
            <CardBody>
              <Table
                onCompare={selectedRowIds => this.compareResults(selectedRowIds)}
                columns={columns}
                data={searchResults.results ? searchResults.results : []}
                loading={loadingSearchResults}
                isCheckable
              />
            </CardBody>
          </Card>
        </PageSection>
      </React.Fragment>
    );
  }
}

export default SearchList;
