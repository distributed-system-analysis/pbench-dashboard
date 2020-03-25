import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import jschart from 'jschart';

import Select from '@/components/Select';

export default class TimeseriesGraph extends PureComponent {
  static propTypes = {
    dataSeriesNames: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    graphId: PropTypes.string.isRequired,
    graphName: PropTypes.string,
    graphOptions: PropTypes.object,
    xAxisSeries: PropTypes.string.isRequired,
    xAxisTitle: PropTypes.string,
    yAxisTitle: PropTypes.string,
  };

  static defaultProps = {
    graphName: null,
    graphOptions: {},
    xAxisTitle: null,
    yAxisTitle: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedValue: 1,
    };
  }

  componentDidMount = () => {
    const {
      xAxisSeries,
      dataSeriesNames,
      data,
      graphId,
      graphName,
      xAxisTitle,
      yAxisTitle,
      graphOptions,
    } = this.props;
    let { selectedValue } = this.state;
    selectedValue -= 1;

    jschart.create_jschart(0, 'timeseries', graphId, graphName, xAxisTitle, yAxisTitle, {
      dynamic_chart: true,
      json_object: {
        x_axis_series: xAxisSeries,
        data_series_names: data.length > 0 ? data[selectedValue].timeseriesLabels : dataSeriesNames,
        data: data.length > 0 ? data[selectedValue].timeseriesAggregation : data,
      },
      ...graphOptions,
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { data, dataSeriesNames, xAxisSeries, graphId } = this.props;
    let { selectedValue } = this.state;
    selectedValue -= 1;

    if (
      JSON.stringify(prevProps.data) !== JSON.stringify(data) ||
      JSON.stringify(prevProps.dataSeriesNames) !== JSON.stringify(dataSeriesNames) ||
      prevProps.xAxisSeries !== xAxisSeries ||
      prevState.selectedValue !== selectedValue
    ) {
      jschart.chart_reload_options(graphId, {
        json_object: {
          x_axis_series: xAxisSeries,
          data_series_names:
            data.length > 0 ? data[selectedValue].timeseriesLabels : dataSeriesNames,
          data: data.length > 0 ? data[selectedValue].timeseriesAggregation : data,
        },
      });
    }
  };

  onSelect = (event, selection) => {
    this.setState({
      selectedValue: selection,
    });
  };

  render() {
    const { graphId, options } = this.props;
    const { selectedValue } = this.state;

    return (
      <div>
        {options && (
          <Select onSelect={this.onSelect} options={options} selected={selectedValue.toString()} />
        )}
        <div id={graphId} />
      </div>
    );
  }
}
