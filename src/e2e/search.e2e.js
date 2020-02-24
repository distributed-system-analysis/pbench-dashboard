import puppeteer from 'puppeteer';
import moment from 'moment';
import { mockIndices, mockMappings, mockSearch } from '../../mock/api';

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
  await page.goto('http://localhost:8000/dashboard/#/search/');

  // Intercept network requests
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (request.method() === 'POST' && request.postData().includes('query_string')) {
      request.respond({
        status: 200,
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(mockSearch),
      });
    } else if (request.method() === 'GET' && request.url().includes('aliases')) {
      request.respond({
        status: 200,
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(mockIndices),
      });
    } else if (request.method() === 'GET' && request.url().includes('mappings')) {
      request.respond({
        status: 200,
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(mockMappings),
      });
    } else {
      request.continue();
    }
  });
});

afterAll(() => {
  browser.close();
});

describe('search page component', () => {
  test('should load mappings', async () => {
    await page.waitForSelector('.ant-select:nth-child(2) > .ant-select-selection');
    const testField = await page.$eval(
      '.ant-select:nth-child(2) > .ant-select-selection > .ant-select-selection__rendered > ul > .ant-select-selection__choice',
      elem => elem.getAttribute('title')
    );
    expect(testField).toBe('run.name');
  });

  test('should select field tag', async () => {
    await page.waitForSelector('.ant-select:nth-child(2) > .ant-select-selection', {
      visible: true,
    });
    const elementToClickHandle = await page.$('.ant-select:nth-child(2) > .ant-select-selection');
    await page.evaluate(el => el.click(), elementToClickHandle);
    await page.waitForSelector(
      '.ant-select-dropdown-menu > .ant-select-dropdown-menu-item-active',
      {
        visible: true,
      }
    );
    await page.click('.ant-select-dropdown-menu > .ant-select-dropdown-menu-item-active');
    await page.click(
      '.ant-select-dropdown-menu > .ant-select-dropdown-menu-item-active[aria-selected="false"]'
    );
  });

  test('should display the date picker component on click', async () => {
    await page.waitForSelector(
      '.ant-row > div > .ant-calendar-picker > .ant-calendar-picker-input'
    );
    await page.click(
      '.ant-row > div > .ant-calendar-picker > .ant-calendar-picker-input > .ant-calendar-range-picker-input'
    );
    await page.waitForSelector('.ant-calendar-picker-container', { visible: true });
    await page.click('.ant-row > div > p');
  });

  test('should change the selected dates after picking them from the calendar', async () => {
    await page.waitForSelector(
      '.ant-row > div > .ant-calendar-picker > .ant-calendar-picker-input'
    );
    await page.click(
      '.ant-row > div > .ant-calendar-picker > .ant-calendar-picker-input > .ant-calendar-range-picker-input'
    );
    await page.click(
      '.ant-calendar-panel > .ant-calendar-footer > .ant-calendar-footer-btn > .ant-calendar-footer-extra > span.ant-tag.ant-tag-blue:nth-child(3)'
    );
    const startDate = await page.$eval(
      '.ant-row > div > .ant-calendar-picker > .ant-calendar-picker-input > .ant-calendar-range-picker-input:nth-child(1)',
      elem => {
        return elem.defaultValue.slice(0, -3);
      }
    );
    expect(moment(startDate).isValid()).toBe(true);
  });

  test('should apply filter changes', async () => {
    await page.waitForSelector(
      '.ant-spin-container > .ant-form > .ant-row > div > .ant-btn-primary'
    );
    await page.click('.ant-spin-container > .ant-form > .ant-row > div > .ant-btn-primary');
  });

  test('should reset filter changes', async () => {
    await page.waitForSelector(
      '.ant-spin-container > .ant-form > .ant-row > div > .ant-btn-secondary'
    );
    await page.click('.ant-spin-container > .ant-form > .ant-row > div > .ant-btn-secondary');
  });

  test('should input search query', async () => {
    await page.type('.ant-input', 'test', { delay: 50 });
  });

  test('should execute search query', async () => {
    await page.waitForSelector('.ant-input-search-button', { visible: true });
    await page.click('.ant-input-search-button');
    await page.waitForSelector('.ant-table-tbody > tr > td:nth-child(2)', { visible: true });
    const testResult = await page.$eval(
      '.ant-table-tbody > tr > td:nth-child(2)',
      elem => elem.innerHTML
    );
    expect(testResult).toBe('test_run');
  });
});
