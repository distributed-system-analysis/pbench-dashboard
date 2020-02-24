import puppeteer from 'puppeteer';
import { generateMockControllerAggregation, mockIndices, mockResults } from '../../mock/api';

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  });
  page = await browser.newPage();
  await page.goto('http://localhost:8000/dashboard/#/');
  // Login using dummy credentials
  await page.waitForSelector(
    '.pf-l-grid > .pf-l-grid__item > .pf-l-grid > .pf-l-grid__item:nth-child(1) > .pf-c-button'
  );
  await page.click(
    '.pf-l-grid > .pf-l-grid__item > .pf-l-grid > .pf-l-grid__item:nth-child(1) > .pf-c-button'
  );
  await page.waitForSelector('.pf-l-grid #horizontal-form-name');
  await page.click('.pf-l-grid #horizontal-form-name');
  await page.type('.pf-l-grid #horizontal-form-name', 'admin');
  await page.waitForSelector('.pf-l-grid #horizontal-form-password');
  await page.click('.pf-l-grid #horizontal-form-password');
  await page.type('.pf-l-grid #horizontal-form-password', 'admin');
  await page.waitForSelector('#submitBtn');
  await page.click('#submitBtn');

  // Intercept network requests
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (request.method() === 'POST' && request.postData().includes('controllers')) {
      request.respond({
        status: 200,
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(generateMockControllerAggregation),
      });
    } else if (request.method() === 'GET' && request.url().includes('aliases')) {
      request.respond({
        status: 200,
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(mockIndices),
      });
    } else if (request.method() === 'POST' && request.postData().includes('run.controller')) {
      request.respond({
        status: 200,
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(mockResults),
      });
    } else {
      request.continue();
    }
  });
});

afterAll(() => {
  browser.close();
});

describe('results page component', () => {
  test(
    'should load controllers',
    async done => {
      await page.waitForSelector('.ant-table-row[data-row-key]', { visible: true });
      const testController = await page.$eval('.ant-table-row', elem =>
        elem.getAttribute('data-row-key')
      );
      expect(testController).toBe('controller_1');
      done();
    },
    30000
  );

  test('should navigate to result', async () => {
    await page.waitForSelector('.ant-table-row[data-row-key]', { visible: true });
    await page.click('.ant-table-row[data-row-key]');
  });

  test('should search for result name', async () => {
    await page.waitForSelector('.ant-table-row[data-row-key]', { visible: true });
    let testRun = await page.$eval('.ant-table-row', elem => elem.getAttribute('data-row-key'));
    await page.type('.ant-input', testRun);
    await page.click('.ant-input-search-button');
    testRun = await page.$eval('.ant-table-row', elem => elem.getAttribute('data-row-key'));
    expect(testRun).toBe('a_test_run');
  });

  test('should reset search results', async () => {
    await page.waitForSelector(
      '.ant-input-wrapper > .ant-input-search > .ant-input-suffix > .anticon > svg'
    );
    await page.click('.ant-input-wrapper > .ant-input-search > .ant-input-suffix > .anticon > svg');
    await page.waitForSelector('.ant-table-row[data-row-key]', { visible: true });

    const testRun = await page.$eval('.ant-table-row', elem => elem.getAttribute('data-row-key'));
    expect(testRun).toBe('a_test_run');
  });

  test('should sort result column alphabetically ascending', async () => {
    await page.waitForSelector(
      '.ant-table-thead > tr > .ant-table-column-has-actions:nth-child(2) > .ant-table-header-column > .ant-table-column-sorters'
    );
    await page.click(
      '.ant-table-thead > tr > .ant-table-column-has-actions:nth-child(2) > .ant-table-header-column > .ant-table-column-sorters'
    );
    const testRun = await page.$eval('.ant-table-row', elem => elem.getAttribute('data-row-key'));
    expect(testRun).toBe('a_test_run');
  });

  test('should sort result column alphabetically descending', async () => {
    await page.waitForSelector(
      '.ant-table-thead > tr > .ant-table-column-has-actions:nth-child(2) > .ant-table-header-column > .ant-table-column-sorters'
    );
    await page.click(
      '.ant-table-thead > tr > .ant-table-column-has-actions:nth-child(2) > .ant-table-header-column > .ant-table-column-sorters'
    );
    const testRun = await page.$eval('.ant-table-row', elem => elem.getAttribute('data-row-key'));
    expect(testRun).toBe('b_test_run');
  });

  test('should sort start time column chronologically ascending', async () => {
    await page.waitForSelector(
      '.ant-table-thead > tr > .ant-table-column-has-actions:nth-child(4) > .ant-table-header-column > .ant-table-column-sorters'
    );
    await page.click(
      '.ant-table-thead > tr > .ant-table-column-has-actions:nth-child(4) > .ant-table-header-column > .ant-table-column-sorters'
    );
    const testRun = await page.$eval('.ant-table-row', elem => elem.getAttribute('data-row-key'));
    expect(testRun).toBe('a_test_run');
  });

  test('should sort start time column chronologically descending', async () => {
    await page.waitForSelector(
      '.ant-table-thead > tr > .ant-table-column-has-actions:nth-child(4) > .ant-table-header-column > .ant-table-column-sorters'
    );
    await page.click(
      '.ant-table-thead > tr > .ant-table-column-has-actions:nth-child(4) > .ant-table-header-column > .ant-table-column-sorters'
    );
    const testRun = await page.$eval('.ant-table-row', elem => elem.getAttribute('data-row-key'));
    expect(testRun).toBe('b_test_run');
  });
});
