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
  await page.goto('http://localhost:8000/dashboard/');

  // Intercept network requests
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (request.method() === 'POST' && request.url().includes('/controllers/list')) {
      request.respond({
        status: 200,
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(generateMockControllerAggregation),
      });
    } else if (request.method() === 'GET' && request.url().includes('/controllers/months')) {
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
    await page.waitForSelector(
      '.pf-c-card > .pf-c-card__body > .ant-form > .pf-c-input-group > .pf-c-form-control'
    );
    await page.click(
      '.pf-c-card > .pf-c-card__body > .ant-form > .pf-c-input-group > .pf-c-form-control'
    );
    await page.type(
      '.pf-c-card > .pf-c-card__body > .ant-form > .pf-c-input-group > .pf-c-form-control',
      testRun
    );
    await page.waitForSelector(
      '.pf-c-card__body > .ant-form > .pf-c-input-group > .pf-c-button > svg'
    );
    await page.click('.pf-c-card__body > .ant-form > .pf-c-input-group > .pf-c-button > svg');
    testRun = await page.$eval('.ant-table-row', elem => elem.getAttribute('data-row-key'));
    expect(testRun).toBe('a_test_run');
  });

  test('should reset search results', async () => {
    await page.waitForSelector(
      '.pf-c-card > .pf-c-card__body > .ant-form > .pf-c-input-group > .pf-c-form-control'
    );
    await page.click(
      '.pf-c-card > .pf-c-card__body > .ant-form > .pf-c-input-group > .pf-c-form-control'
    );
    let testRun = await page.$eval('.ant-table-row', elem => elem.getAttribute('data-row-key'));
    for (let i = 0; i < testRun.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await page.keyboard.press('Backspace');
    }
    await page.waitForSelector(
      '.pf-c-card__body > .ant-form > .pf-c-input-group > .pf-c-button > svg'
    );
    await page.click('.pf-c-card__body > .ant-form > .pf-c-input-group > .pf-c-button > svg');
    testRun = await page.$eval('.ant-table-row', elem => elem.getAttribute('data-row-key'));
    expect(testRun).toBe('a_test_run');
  });

  test('should sort result column alphabetically ascending', async () => {
    await page.waitForSelector('.ant-table-row[data-row-key]', { visible: true });
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
    await page.waitForSelector('.ant-table-row[data-row-key]', { visible: true });
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
    await page.waitForSelector('.ant-table-row[data-row-key]', { visible: true });
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
    await page.waitForSelector('.ant-table-row[data-row-key]', { visible: true });
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
