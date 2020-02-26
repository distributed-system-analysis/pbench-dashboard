import React from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Tabs, Spin, Tag, Button, Form, Modal, Input, Switch, message } from 'antd';
import { ResponsiveBar } from '@nivo/bar';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { generateClusters } from '../../utils/parse';

const { Description } = DescriptionList;
const { TabPane } = Tabs;

@connect(({ dashboard, global, datastore }) => ({
  iterationParams: dashboard.iterationParams,
  selectedControllers: global.selectedControllers,
  selectedResults: global.selectedResults,
  selectedIndices: global.selectedIndices,
  selectedIterations: global.selectedIterations,
  datastoreConfig: datastore.datastoreConfig,
}))
class RunComparison extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clusters: {},
      clusterKeys: [],
      loadingClusters: false,
      loadingPdf: false,
      exportModalVisible: false,
      defaultComponents: ['details', 'summary', 'table', 'timeseries'],
      selectedComponents: [],
      pdfHeader: '',
      pdfName: '',
    };
  }

  componentDidMount() {
    const {
      iterationParams,
      selectedIterations,
      selectedResults,
      selectedIndices,
      datastoreConfig,
      dispatch,
    } = this.props;

    dispatch({
      type: 'dashboard/fetchIterationData',
      payload: { selectedResults, selectedIndices, datastoreConfig },
    });
    const clusters = generateClusters(selectedIterations, iterationParams);
    dispatch({
      type: 'dashboard/fetchTimeseriesData',
      payload: { selectedResults, selectedIndices, datastoreConfig },
    });
    this.setState({ clusters: clusters.data });
    this.setState({ clusterKeys: [...clusters.keys] });
  }

  onResetIterationClusters = () => {
    const { iterationParams, selectedIterations } = this.props;

    this.onGenerateIterationClusters(Object.keys(iterationParams), selectedIterations);
  };

  onChangeIterationClusters = clusters => {
    const { selectedIterations } = this.props;

    this.onGenerateIterationClusters(clusters, selectedIterations);
  };

  onTimeseriesClusterChange = (value, primaryMetric) => {
    const { timeseriesDropdownSelected } = this.state;
    timeseriesDropdownSelected[primaryMetric] = value;
    this.setState({ timeseriesDropdownSelected });
  };

  savePDF = () => {
    const { pdfHeader, pdfName, selectedComponents } = this.state;

    // eslint-disable-next-line new-cap
    let doc = new jsPDF('p', 'mm', 'a4', true);
    let position = 5;
    let fullIHeight = 0;
    const promises = selectedComponents.map(async (check, index) => {
      await html2canvas(document.querySelector(`#${check}`), { allowTaint: true }).then(canvas => {
        doc.setPage(index);
        canvas.getContext('2d');
        const imgData = canvas.toDataURL();
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        position = fullIHeight + 5;
        fullIHeight += imgHeight;
        let heightLeft = fullIHeight;
        doc = doc.addImage(imgData, 'PNG', 3, position, imgWidth, imgHeight, '', 'FAST');
        doc.text(pdfHeader, 115, 10, 'center');
        heightLeft -= pageHeight;
        while (heightLeft >= 0) {
          position = heightLeft - fullIHeight;
          doc.addPage();
          doc = doc.addImage(imgData, 'PNG', 3, position, imgWidth, imgHeight, '', 'FAST');
          heightLeft -= pageHeight;
        }
      });
    });
    Promise.all(promises).then(() => {
      doc.save(`${pdfName}.pdf`);
      this.setState({
        exportModalVisible: false,
        loadingPdf: false,
      });
    });
  };

  showExportModal = () => {
    this.setState({
      exportModalVisible: true,
    });
  };

  hideExportModal = () => {
    this.setState({
      exportModalVisible: false,
    });
  };

  onExportPdf = () => {
    const { pdfName, pdfHeader, defaultComponents } = this.state;

    this.setState(
      {
        pdfName: document.getElementById('pdfName').value,
        pdfHeader: document.getElementById('pdfHeader').value,
      },
      () => {
        if (pdfName === '') {
          this.setState({
            pdfName: moment().format(),
          });
        }
        if (pdfHeader === '') {
          message.error('Add PDF description');
        } else {
          this.setState(
            {
              loadingPdf: true,
              selectedComponents: defaultComponents.length === 4 ? ['all'] : [...defaultComponents],
            },
            () => {
              this.savePDF();
            }
          );
        }
      }
    );
  };

  onSelectPageSection = id => {
    const { defaultComponents } = this.state;

    if (defaultComponents.includes(id)) {
      const components = defaultComponents.filter(check => check !== id);
      this.setState({
        defaultComponents: components,
      });
    } else {
      this.setState({
        defaultComponents: [...defaultComponents, id],
      });
    }
  };

  render() {
    const { clusters, clusterKeys, loadingPdf, exportModalVisible, loadingClusters } = this.state;
    const { selectedControllers, selectedResults } = this.props;

    const description = (
      <DescriptionList size="small" col="1" gutter={16}>
        <Description term="Controllers">
          {selectedControllers.map(controller => (
            <Tag key={controller}>{controller}</Tag>
          ))}
        </Description>
        <Description term="Results">
          {selectedResults.map(result => (
            <Tag key={result}>{result['run.name']}</Tag>
          ))}
        </Description>
      </DescriptionList>
    );

    const action = (
      <div>
        <Button type="primary" onClick={this.showExportModal}>
          Export
        </Button>
      </div>
    );

    const exportModal = (
      <Modal
        title="Export to PDF"
        visible={exportModalVisible}
        onOk={this.onExportPdf}
        okText="Save"
        onCancel={this.hideExportModal}
      >
        <Spin spinning={loadingPdf}>
          <Form>
            <Form.Item
              colon={false}
              label="File Name"
              extra="(Optional) Timestamp will be used if left blank"
            >
              <Input addonAfter=".pdf" id="pdfName" />
            </Form.Item>
            <Form.Item colon={false} label="Description" extra="(Optional)">
              <Input id="pdfHeader" />
            </Form.Item>
          </Form>

          <Card type="inner" title="Render Options">
            <Form layout="inline">
              <Form.Item colon={false} label="Details">
                <Switch
                  defaultChecked
                  onSelectPageSection={() => this.onSelectPageSection('details')}
                />
              </Form.Item>
              <Form.Item colon={false} label="Summary Graphs">
                <Switch
                  defaultChecked
                  onSelectPageSection={() => this.onSelectPageSection('summary')}
                />
              </Form.Item>
              <Form.Item colon={false} label="Timeseries Graphs">
                <Switch
                  defaultChecked
                  onSelectPageSection={() => this.onSelectPageSection('timeseries')}
                />
              </Form.Item>
              <Form.Item colon={false} label="Cluster Tables">
                <Switch
                  defaultChecked
                  onSelectPageSection={() => this.onSelectPageSection('table')}
                />
              </Form.Item>
            </Form>
          </Card>
        </Spin>
      </Modal>
    );

    return (
      <div id="all">
        <div id="details">
          <PageHeaderLayout title="Run Comparison Details" content={description} action={action} />
        </div>
        {exportModal}
        <br />
        <Card bordered bodyStyle={{ padding: 4 }} id="summary">
          <Tabs size="large">
            <TabPane tab="Summary" key="summary" style={{ padding: 16 }}>
              <Spin spinning={loadingClusters}>
                {Object.keys(clusters).map(cluster => (
                  <div>
                    <Row style={{ marginTop: 16 }}>
                      <Col xl={16} lg={12} md={12} sm={24} xs={24} style={{ height: 550 }}>
                        <h4 style={{ marginLeft: 16 }}>{cluster}</h4>
                        <ResponsiveBar
                          data={clusters[cluster].map(iteration => iteration.cluster)}
                          keys={clusterKeys}
                          enableLabel={false}
                          indexBy="cluster"
                          groupMode="grouped"
                          padding={0.3}
                          labelSkipWidth={18}
                          labelSkipHeight={18}
                          tooltip={({ id, index, value }) => (
                            <div style={{ backgroundColor: 'white', color: 'grey' }}>
                              <Row>
                                <Col>Result</Col>
                                <Col>{clusters[cluster][index][id].run.name}</Col>
                              </Row>
                              <br />
                              <Row>
                                <Col>Sample</Col>
                                <Col>{clusters[cluster][index][id].sample.name}</Col>
                              </Row>
                              <br />
                              <Row>
                                <Col>Mean</Col>
                                <Col>{value}</Col>
                              </Row>
                            </div>
                          )}
                          borderColor="inherit:darker(1.6)"
                          margin={{
                            top: 32,
                            left: 64,
                            bottom: 64,
                            right: 124,
                          }}
                        />
                      </Col>
                    </Row>
                  </div>
                ))}
              </Spin>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    );
  }
}

export default RunComparison;
