import { generateSampleTable, generateClusters } from './parse';
import { mockSamples } from '../../mock/api';

const parsedSampleTable = generateSampleTable([mockSamples]);
const parsedClusterData = generateClusters(
  parsedSampleTable.runs,
  parsedSampleTable.iterationParams
);

describe('test generateSampleTable', () => {
  it('should generate sample table data', () => {
    expect(Object.keys(parsedSampleTable).length > 0);
  });
});

describe('test generateClusters', () => {
  it('should generate cluster data', () => {
    expect(Object.keys(parsedClusterData).length > 0);
  });
});
