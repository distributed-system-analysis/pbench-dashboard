import _ from 'lodash';
import { generateSampleTable, generateClusters } from './parse';
import { mockDataSample, expectedSampleData, expectedClusterData } from '../../mock/api';

describe('test generateSampleTable', () => {
  const parsedSampleTable = generateSampleTable(mockDataSample);
  it('should generate sample table data', () => {
    expect(Object.keys(parsedSampleTable).length > 0);
  });
  it('should equal mocked sample table data', () => {
    expect(_.isEqual(parsedSampleTable, expectedSampleData));
  });
});

describe('test generateClusters', () => {
  const parsedClusterData = generateClusters(
    expectedSampleData.runs,
    expectedSampleData.iterationParams
  );
  it('should generate cluster data', () => {
    expect(Object.keys(parsedClusterData).length > 0);
  });
  it('should equal mocked cluster data', () => {
    expect(_.isEqual(parsedClusterData, expectedClusterData));
  });
});
