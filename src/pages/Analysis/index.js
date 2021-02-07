import React from 'react';
import {
  Grid,
  GridItem,
  Card,
  TextContent,
  Text,
  TextVariants,
  Button,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import styles from './index.less';
import AnalysisChart from '@/components/AnalysisChart';
import { donutChart1, donutChart2, barGraph1, barGraph2 } from '../../../mock/analysis';

const legends = {
  'pbench-user-benchmark': 'blue',
  trafficgen: 'cyan',
  uperf: 'orange',
  linpack: 'gold',
  fio: 'purple',
};

const legendField = Object.keys(legends).map(function(key) {
  return (
    <div>
      <span className={styles.colorBox} style={{ backgroundColor: legends[key] }} />
      <span className={styles.legendLabel}>{key}</span>
    </div>
  );
});

function Analysis() {
  return (
    <div className={styles.paddingBig}>
      <TextContent className={styles.paddingSmall}>
        <Grid>
          <GridItem span={6}>
            <Text component={TextVariants.h1}> Analysis</Text>
          </GridItem>
          <GridItem span={6}>
            <Text component={TextVariants.h3} style={{ textAlign: 'right' }}>
              {' '}
              Total runs: 1,179
            </Text>
          </GridItem>
        </Grid>
      </TextContent>
      <Grid className={styles.paddingSmall}>
        <GridItem span={12}>
          <Card className={styles.borderedCard}>
            <div className={styles.paddingBig}>
              <TextContent>
                <Text component={TextVariants.h2}>
                  {' '}
                  Runs
                  <Button variant="link" icon={<ExternalLinkAltIcon />} style={{ float: 'right' }}>
                    View in Kibana
                  </Button>
                </Text>
              </TextContent>
            </div>
          </Card>
          <Card className={styles.borderedCard}>
            <Grid>
              <GridItem span={7}>
                <TextContent className={styles.paddingMedium}>
                  <Text component={TextVariants.h3} style={{ color: 'grey' }}>
                    {' '}
                    Click on sections of the graph to view detailed data
                  </Text>
                </TextContent>
                <Grid>
                  <GridItem span={5} offset={1}>
                    <div style={{ height: '260px', width: '260px' }} className={styles.paddingBig}>
                      <AnalysisChart chartType="donut" usedSpace={donutChart1} />
                    </div>
                  </GridItem>
                  <GridItem span={6}>
                    <div style={{ height: '260px', width: '260px' }} className={styles.paddingBig}>
                      <AnalysisChart chartType="donut" usedSpace={donutChart2} />
                    </div>
                  </GridItem>
                </Grid>
              </GridItem>
              <GridItem span={5} style={{ borderLeft: '1px solid #b3b2b2' }}>
                <div className={styles.paddingBig}>
                  <TextContent>
                    <Text component={TextVariants.h3}>example.eng.bos.redhat.com</Text>
                    <Text component={TextVariants.h4}>Field</Text>
                    <a>run.controller</a>
                    <Text component={TextVariants.h4}>Value</Text>
                    <a>scale-ci-example</a>
                    <Text component={TextVariants.h4}>Count</Text>
                    <span>54(3.81%)</span>
                  </TextContent>
                </div>
              </GridItem>
            </Grid>
          </Card>
          <Card className={styles.borderedCard}>
            <div className={styles.paddingBig}>
              <TextContent>
                <span>
                  <Text component={TextVariants.h3} style={{ display: 'inline' }}>
                    Legend
                  </Text>
                </span>
                <span className={styles.colorBoxInline} style={{ backgroundColor: 'blue' }} />
                <span className={styles.legendLabel}>example.controller.com</span>
                <span className={styles.colorBoxInline} style={{ backgroundColor: 'green' }} />
                <span className={styles.legendLabel}>example.controller.com</span>
                <span className={styles.colorBoxInline} style={{ backgroundColor: 'red' }} />
                <span className={styles.legendLabel}>example.controller.com</span>
                <span className={styles.colorBoxInline} style={{ backgroundColor: 'violet' }} />
                <span className={styles.legendLabel}>example.controller.com</span>
                <span className={styles.colorBoxInline} style={{ backgroundColor: '#f0ab00' }} />
                <span className={styles.legendLabel}>example.controller.com</span>
              </TextContent>
            </div>
          </Card>
        </GridItem>
      </Grid>
      <Grid className={styles.paddingSmall}>
        <GridItem span={12}>
          <Card className={styles.borderedCard}>
            <div className={styles.paddingBig}>
              <TextContent>
                <Text component={TextVariants.h2}>
                  {' '}
                  Runs over time
                  <Button variant="link" icon={<ExternalLinkAltIcon />} style={{ float: 'right' }}>
                    View in Kibana
                  </Button>
                </Text>
              </TextContent>
            </div>
          </Card>
          <Card className={styles.borderedCard}>
            <Grid>
              <GridItem span={8}>
                <TextContent className={styles.paddingMedium}>
                  <Text component={TextVariants.h4} style={{ color: 'grey' }}>
                    {' '}
                    @metadata.satellite.EC2: filters
                  </Text>
                </TextContent>
                <Grid>
                  <div className={styles.borderedCard}>
                    <AnalysisChart chartType="bar" barData={barGraph1} />
                  </div>
                  <TextContent className={styles.paddingMedium}>
                    <Text component={TextVariants.h4} style={{ color: 'grey' }}>
                      {' '}
                      NOT @metadata.satellite.EC2: filters
                    </Text>
                  </TextContent>
                  <div className={styles.borderedCard}>
                    <AnalysisChart chartType="bar" barData={barGraph2} chartColor="gold" />
                  </div>
                </Grid>
              </GridItem>
              <GridItem span={4} style={{ borderLeft: '1px solid #b3b2b2' }}>
                <div className={styles.paddingBig}>
                  <TextContent>
                    <span>
                      <Text component={TextVariants.h3}>Legend</Text>
                    </span>
                    {legendField}
                  </TextContent>
                </div>
              </GridItem>
            </Grid>
          </Card>
        </GridItem>
      </Grid>
    </div>
  );
}

export default Analysis;
