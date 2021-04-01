import React from 'react';
import { Pagination as PatternFlyPagination, PaginationVariant } from '@patternfly/react-core';

export default class Pagination extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      perPage: 20,
    };
  }

  onSetPage = (_event, pageNumber) => {
    const { onSetPage } = this.props;
    onSetPage(pageNumber);

    this.setState({
      page: pageNumber,
    });
  };

  onPerPageSelect = (_event, perPage) => {
    const { onPerPageSelect } = this.props;
    onPerPageSelect(perPage);

    this.setState({
      perPage,
    });
  };

  render() {
    const { itemCount, onFirstClick, onLastClick, onNextClick, onPreviousClick } = this.props;
    const { perPage, page } = this.state;
    const defaultPerPageOptions = [
      { title: '20', value: 20 },
      { title: '50', value: 50 },
      { title: '75', value: 75 },
      { title: '100', value: 100 },
    ];

    return (
      <PatternFlyPagination
        itemCount={itemCount}
        perPage={perPage}
        perPageOptions={defaultPerPageOptions}
        page={page}
        variant={PaginationVariant.bottom}
        onSetPage={this.onSetPage}
        onPerPageSelect={this.onPerPageSelect}
        onFirstClick={onFirstClick}
        onLastClick={onLastClick}
        onNextClick={onNextClick}
        onPreviousClick={onPreviousClick}
      />
    );
  }
}
