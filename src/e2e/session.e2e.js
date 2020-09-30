import puppeteer from 'puppeteer';
import { generateMockControllerAggregation, mockIndices, mockSessionUrl } from '../../mock/api';

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
    } else if (request.method() === 'POST' && request.postData().includes('config')) {
      request.respond({
        status: 200,
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(mockSessionUrl),
      });
    } else {
      request.continue();
    }
  });
});

afterAll(() => {
  browser.close();
});

describe('session flow', () => {
  test(
    'should load controllers',
    async () => {
      await page.waitForSelector('.ant-table-row[data-row-key]', { visible: true });
      const testController = await page.$eval('.ant-table-row', elem =>
        elem.getAttribute('data-row-key')
      );
      expect(testController).toBe('controller_1');
    },
    30000
  );

  test('should generate user session', async () => {
    await page.waitForSelector(
      '#root > div > header > div.pf-c-page__header-tools > span > div > button'
    );
    await page.click('#root > div > header > div.pf-c-page__header-tools > span > div > button');

    await page.waitForSelector('.ant-input');
    await page.type('.ant-input', 'controller page test', { delay: 50 });

    await page.waitForSelector(
      'body > div:nth-child(3) > div > div.ant-modal-wrap > div > div.ant-modal-content > div.ant-modal-footer > button:nth-child(2)'
    );
    await page.click(
      'body > div:nth-child(3) > div > div.ant-modal-wrap > div > div.ant-modal-content > div.ant-modal-footer > button:nth-child(2)'
    );
  });

  test(
    'should copy session link',
    async () => {
      await page.waitForSelector(
        'body > div:nth-child(5) > div > div.ant-modal-wrap > div > div.ant-modal-content > div > div > div.ant-modal-confirm-body > div > div > button'
      );
      await page.click(
        'body > div:nth-child(5) > div > div.ant-modal-wrap > div > div.ant-modal-content > div > div > div.ant-modal-confirm-body > div > div > button'
      );
    },
    30000
  );
});
