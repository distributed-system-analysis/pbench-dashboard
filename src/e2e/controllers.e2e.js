import puppeteer from 'puppeteer';
import { generateMockControllerAggregation, mockIndices } from '../../mock/api';

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
    } else {
      request.continue();
    }
  });
});

afterAll(() => {
  browser.close();
});

describe('controller page component', () => {
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

  test('should search for controller name', async () => {
    await page.waitForSelector('.ant-table-row[data-row-key]', { visible: true });
    let testController = await page.$eval('.ant-table-row', elem =>
      elem.getAttribute('data-row-key')
    );
    await page.waitForSelector(
      '.pf-c-card > .pf-c-card__body > .ant-form > .pf-c-input-group > .pf-c-form-control'
    );
    await page.click(
      '.pf-c-card > .pf-c-card__body > .ant-form > .pf-c-input-group > .pf-c-form-control'
    );
    await page.type(
      '.pf-c-card > .pf-c-card__body > .ant-form > .pf-c-input-group > .pf-c-form-control',
      testController
    );
    await page.waitForSelector(
      '.pf-c-card__body > .ant-form > .pf-c-input-group > .pf-c-button > svg'
    );
    await page.click('.pf-c-card__body > .ant-form > .pf-c-input-group > .pf-c-button > svg');
    testController = await page.$eval('.ant-table-row', elem => elem.getAttribute('data-row-key'));
    expect(testController).toBe('controller_1');
  });

  test('should reset search results', async () => {
    await page.waitForSelector(
      '.pf-c-card > .pf-c-card__body > .ant-form > .pf-c-input-group > .pf-c-form-control'
    );
    await page.click(
      '.pf-c-card > .pf-c-card__body > .ant-form > .pf-c-input-group > .pf-c-form-control'
    );
    let testController = await page.$eval('.ant-table-row', elem =>
      elem.getAttribute('data-row-key')
    );
    for (let i = 0; i < testController.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await page.keyboard.press('Backspace');
    }
    await page.waitForSelector(
      '.pf-c-card__body > .ant-form > .pf-c-input-group > .pf-c-button > svg'
    );
    await page.click('.pf-c-card__body > .ant-form > .pf-c-input-group > .pf-c-button > svg');
    testController = await page.$eval('.ant-table-row', elem => elem.getAttribute('data-row-key'));
    expect(testController).toBe('controller_1');
  });

  test('should sort controllers column alphabetically ascending', async () => {
    await page.waitForSelector('.ant-table-row[data-row-key]', { visible: true });
    await page.waitForSelector(
      '.ant-table-thead > tr > .ant-table-column-has-actions:nth-child(1) > .ant-table-header-column > .ant-table-column-sorters'
    );
    await page.click(
      '.ant-table-thead > tr > .ant-table-column-has-actions:nth-child(1) > .ant-table-header-column > .ant-table-column-sorters'
    );
    const testController = await page.$eval('.ant-table-row', elem =>
      elem.getAttribute('data-row-key')
    );
    expect(testController).toBe('controller_1');
  });

  test('should sort controllers column alphabetically descending', async () => {
    await page.waitForSelector('.ant-table-row[data-row-key]', { visible: true });
    await page.waitForSelector(
      '.ant-table-thead > tr > .ant-table-column-has-actions:nth-child(1) > .ant-table-header-column > .ant-table-column-sorters'
    );
    await page.click(
      '.ant-table-thead > tr > .ant-table-column-has-actions:nth-child(1) > .ant-table-header-column > .ant-table-column-sorters'
    );
    const testController = await page.$eval('.ant-table-row', elem =>
      elem.getAttribute('data-row-key')
    );
    expect(testController).toBe('controller_99');
  });

  test('should sort last modified column chronologically ascending', async () => {
    await page.waitForSelector(
      '.ant-table-thead > tr > .ant-table-column-has-actions:nth-child(2) > .ant-table-header-column > .ant-table-column-sorters'
    );
    await page.click(
      '.ant-table-thead > tr > .ant-table-column-has-actions:nth-child(2) > .ant-table-header-column > .ant-table-column-sorters'
    );
    const testController = await page.$eval('.ant-table-row', elem =>
      elem.getAttribute('data-row-key')
    );
    expect(testController).toBe('controller_1');
  });

  test('should sort last modified column chronologically descending', async () => {
    await page.waitForSelector(
      '.ant-table-thead > tr > .ant-table-column-has-actions:nth-child(2) > .ant-table-header-column > .ant-table-column-sorters'
    );
    await page.click(
      '.ant-table-thead > tr > .ant-table-column-has-actions:nth-child(2) > .ant-table-header-column > .ant-table-column-sorters'
    );
    const testController = await page.$eval('.ant-table-row', elem =>
      elem.getAttribute('data-row-key')
    );
    expect(testController).toBe('controller_100');
  });

  test('should sort results column numerically ascending', async () => {
    await page.waitForSelector(
      '.ant-table-thead > tr > .ant-table-column-has-actions:nth-child(3) > .ant-table-header-column > .ant-table-column-sorters'
    );
    await page.click(
      '.ant-table-thead > tr > .ant-table-column-has-actions:nth-child(3) > .ant-table-header-column > .ant-table-column-sorters'
    );
    const testController = await page.$eval('.ant-table-row', elem =>
      elem.getAttribute('data-row-key')
    );
    expect(testController).toBe('controller_1');
  });

  test('should sort results column numerically descending', async () => {
    await page.waitForSelector(
      '.ant-table-thead > tr > .ant-table-column-has-actions:nth-child(3) > .ant-table-header-column > .ant-table-column-sorters'
    );
    await page.click(
      '.ant-table-thead > tr > .ant-table-column-has-actions:nth-child(3) > .ant-table-header-column > .ant-table-column-sorters'
    );
    const testController = await page.$eval('.ant-table-row', elem =>
      elem.getAttribute('data-row-key')
    );
    expect(testController).toBe('controller_100');
  });

  test('should display 10 controllers in the table', async () => {
    await page.waitForSelector(
      '.ant-pagination-options > .ant-pagination-options-size-changer > .ant-select-selection > .ant-select-selection__rendered > .ant-select-selection-selected-value'
    );
    await page.click('.ant-select-selection-selected-value');
    await page.waitForSelector('.ant-select-dropdown-menu-item:nth-child(1)');
    const elementToClick = await page.$('.ant-select-dropdown-menu-item:nth-child(1)');
    await page.evaluate(el => el.click(), elementToClick);
    const rows = await page.$$('.ant-table-row');
    expect(rows.length).toBe(10);
  });

  test('should display 20 controllers on preference', async () => {
    await page.waitForSelector(
      '.ant-pagination-options > .ant-pagination-options-size-changer > .ant-select-selection > .ant-select-selection__rendered > .ant-select-selection-selected-value'
    );
    await page.click('.ant-select-selection-selected-value');
    await page.waitForSelector('.ant-select-dropdown-menu-item:nth-child(2)');
    const elementToClick = await page.$('.ant-select-dropdown-menu-item:nth-child(2)');
    await page.evaluate(el => el.click(), elementToClick);
    const rows = await page.$$('.ant-table-row');
    expect(rows.length).toBe(20);
  });

  test('should display 50 controllers on preference', async () => {
    await page.waitForSelector(
      '.ant-pagination-options > .ant-pagination-options-size-changer > .ant-select-selection > .ant-select-selection__rendered > .ant-select-selection-selected-value'
    );
    await page.click('.ant-select-selection-selected-value');
    await page.waitForSelector('.ant-select-dropdown-menu-item:nth-child(3)');
    const elementToClickHandle = await page.$('.ant-select-dropdown-menu-item:nth-child(3)');
    await page.evaluate(el => el.click(), elementToClickHandle);
    const rows = await page.$$('.ant-table-row');
    expect(rows.length).toBe(50);
  });

  test('should display 100 controllers on preference', async () => {
    await page.waitForSelector(
      '.ant-pagination-options > .ant-pagination-options-size-changer > .ant-select-selection > .ant-select-selection__rendered > .ant-select-selection-selected-value'
    );
    await page.click('.ant-select-selection-selected-value');
    await page.waitForSelector('.ant-select-dropdown-menu-item:nth-child(4)');
    const elementToClickHandle = await page.$('.ant-select-dropdown-menu-item:nth-child(4)');
    await page.evaluate(el => el.click(), elementToClickHandle);
    const rows = await page.$$('.ant-table-row');
    expect(rows.length).toBe(100);
  });

  test('should display the date picker component on click', async () => {
    await page.waitForSelector(
      '.pf-c-card__body > .ant-form > .index__picker___2L2d5 > .ant-calendar-picker-input'
    );
    await page.click(
      '.pf-c-card__body > .ant-form > .index__picker___2L2d5 > .ant-calendar-picker-input'
    );
  });

  test('should change the selected dates after picking them from the calendar', async () => {
    await page.waitForSelector(
      '.ant-calendar-panel > .ant-calendar-footer > .ant-calendar-footer-btn > .ant-calendar-footer-extra > .ant-tag:nth-child(3)'
    );
    await page.click(
      '.ant-calendar-panel > .ant-calendar-footer > .ant-calendar-footer-btn > .ant-calendar-footer-extra > .ant-tag:nth-child(3)'
    );
  });
});
