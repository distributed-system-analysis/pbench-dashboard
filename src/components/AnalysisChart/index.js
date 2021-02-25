import React, { Component } from 'react';
import {
  Chart,
  ChartBar,
  ChartAxis,
  ChartStack,
  ChartVoronoiContainer,
  ChartDonutThreshold,
  ChartDonutUtilization,
} from '@patternfly/react-charts';

class AnalysisChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      barWidth: '20',
    };
  }

  render() {
    const { barWidth } = this.state;
    const { chartType, usedSpace, barData, chartColor } = this.props;

    const donut = (
      <ChartDonutThreshold
        ariaDesc="Storage capacity"
        ariaTitle="Donut utilization chart with static threshold example"
        constrainToVisibleArea
        data={[{ x: 'Warning at 60%', y: 60 }, { x: 'Danger at 90%', y: 90 }]}
        labels={({ datum }) => (datum.x ? datum.x : null)}
      >
        <ChartDonutUtilization
          data={{ x: 'Storage capacity', y: usedSpace }}
          labels={({ datum }) => (datum.x ? `${datum.x}: ${datum.y}%` : null)}
          thresholds={[{ value: 60 }, { value: 90 }]}
        />
      </ChartDonutThreshold>
    );
    const bar = (
      <Chart
        ariaDesc="mock metdata"
        ariaTitle="mock meta data"
        containerComponent={
          <ChartVoronoiContainer
            labels={({ datum }) => `${datum.name}: ${datum.y}`}
            constrainToVisibleArea
          />
        }
        domainPadding={{ x: [50, 50] }}
        height={500}
        padding={{
          bottom: 50,
          left: 50,
          right: 200,
          top: 50,
        }}
        width={1200}
        themeColor={chartColor}
      >
        <ChartAxis />
        <ChartAxis dependentAxis showGrid />
        <ChartStack>
          <ChartBar data={barData ? barData[0] : []} barWidth={barWidth} />
          <ChartBar data={barData ? barData[1] : []} barWidth={barWidth} />
        </ChartStack>
      </Chart>
    );

    return chartType === 'donut' ? donut : bar;
  }
}

export default AnalysisChart;
