import puppeteer from 'puppeteer';
import { mockControllers, mockIndices } from '../../mock/api';

jest.setTimeout(30000);

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
        body: JSON.stringify(mockControllers),
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
  test('should load controllers', async () => {
    await page.waitForSelector('table > tbody > tr:nth-child(1) > td:nth-child(1) > span');
    const testController = await page.$eval(
      'table > tbody > tr:nth-child(1) > td:nth-child(1) > span',
      elem => elem.innerHTML
    );
    expect(testController).toBe(mockControllers[0].controller);
  });

  test('should search for controller name', async () => {
    await page.waitForSelector('table > tbody > tr:nth-child(1) > td:nth-child(1) > span');
    const testController = await page.$eval(
      'table > tbody > tr:nth-child(1) > td:nth-child(1) > span',
      elem => elem.innerHTML
    );
    await page.waitForSelector('div.pf-c-input-group > input');
    await page.click('div.pf-c-input-group > input');
    await page.type('div.pf-c-input-group > input', testController);
    await page.waitForSelector('div.pf-c-input-group > button');
    await page.click('div.pf-c-input-group > button');
    await page.waitForSelector('table > tbody > tr:nth-child(1) > td:nth-child(1) > span');
    const filteredController = await page.$eval(
      'table > tbody > tr:nth-child(1) > td:nth-child(1) > span',
      elem => elem.innerHTML
    );
    expect(filteredController).toBe(testController);
  });

  test('should reset search results', async () => {
    await page.waitForSelector('div.pf-c-input-group > input');
    await page.click('div.pf-c-input-group > input');
    await page.waitForSelector('table > tbody > tr:nth-child(1) > td:nth-child(1) > span');
    let testController = await page.$eval(
      'table > tbody > tr:nth-child(1) > td:nth-child(1) > span',
      elem => elem.innerHTML
    );
    for (let i = 0; i < testController.length; i += 1) {
      page.keyboard.press('Backspace');
    }
    await page.waitForSelector('div.pf-c-input-group > button');
    await page.click('div.pf-c-input-group > button');
    await page.waitForSelector('table > tbody > tr:nth-child(1) > td:nth-child(1) > span');
    testController = await page.$eval(
      'table > tbody > tr:nth-child(1) > td:nth-child(1) > span',
      elem => elem.innerHTML
    );
    expect(testController).toBe(mockControllers[0].controller);
  });

  test('should sort controllers column alphabetically ascending', async () => {
    await page.waitForSelector('table > thead > tr > th:nth-child(1) > div:nth-child(1) > span');
    await page.click('table > thead > tr > th:nth-child(1) > div:nth-child(1) > span');
    await page.waitForSelector('table > tbody > tr:nth-child(1) > td:nth-child(1) > span');
    const testController = await page.$eval(
      'table > tbody > tr:nth-child(1) > td:nth-child(1) > span',
      elem => elem.innerHTML
    );
    expect(testController).toBe(
      mockControllers.sort((a, b) => (a.controller > b.controller ? 1 : -1))[0].controller
    );
  });

  test('should sort controllers column alphabetically descending', async () => {
    await page.waitForSelector('table > thead > tr > th:nth-child(1) > div:nth-child(1) > span');
    await page.click('table > thead > tr > th:nth-child(1) > div:nth-child(1) > span');
    await page.waitForSelector('table > tbody > tr:nth-child(1) > td:nth-child(1) > span');
    const testController = await page.$eval(
      'table > tbody > tr:nth-child(1) > td:nth-child(1) > span',
      elem => elem.innerHTML
    );
    expect(testController).toBe(
      mockControllers.sort((a, b) => (a.controller > b.controller ? 1 : -1))[
        mockControllers.length - 1
      ].controller
    );
  });

  test('should sort last modified column chronologically ascending', async () => {
    await page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] });
    await page.waitForSelector('table > thead > tr > th:nth-child(2) > div:nth-child(1) > span');
    await page.click('table > thead > tr > th:nth-child(2) > div:nth-child(1) > span');
    await page.waitForSelector('table > tbody > tr:nth-child(1) > td:nth-child(1) > span');
    const testController = await page.$eval(
      'table > tbody > tr:nth-child(1) > td:nth-child(1) > span',
      elem => elem.innerHTML
    );
    expect(testController).toBe(
      mockControllers.sort((a, b) => a.last_modified_value - b.last_modified_value)[0].controller
    );
  });

  test('should sort last modified column chronologically descending', async () => {
    await page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] });
    await page.waitForSelector('table > thead > tr > th:nth-child(2) > div:nth-child(1) > span');
    await page.click('table > thead > tr > th:nth-child(2) > div:nth-child(1) > span');
    await page.waitForSelector('table > thead > tr > th:nth-child(2) > div:nth-child(1) > span');
    await page.click('table > thead > tr > th:nth-child(2) > div:nth-child(1) > span');
    await page.waitForSelector('table > tbody > tr:nth-child(1) > td:nth-child(1) > span');
    const testController = await page.$eval(
      'table > tbody > tr:nth-child(1) > td:nth-child(1) > span',
      elem => elem.innerHTML
    );
    expect(testController).toBe(
      mockControllers.sort((a, b) => a.last_modified_value - b.last_modified_value)[
        mockControllers.length - 1
      ].controller
    );
  });

  test('should sort results column numerically ascending', async () => {
    await page.waitForSelector('table > thead > tr > th:nth-child(3) > div:nth-child(1) > span');
    await page.click('table > thead > tr > th:nth-child(3) > div:nth-child(1) > span');
    await page.waitForSelector('table > tbody > tr:nth-child(1) > td:nth-child(1) > span');
    const testController = await page.$eval(
      'table > tbody > tr:nth-child(1) > td:nth-child(1) > span',
      elem => elem.innerHTML
    );
    expect(testController).toBe(
      mockControllers.sort((a, b) => a.results - b.results)[0].controller
    );
  });

  test('should sort results column numerically descending', async () => {
    await page.waitForSelector('table > thead > tr > th:nth-child(3) > div:nth-child(1) > span');
    await page.click('table > thead > tr > th:nth-child(3) > div:nth-child(1) > span');
    await page.waitForSelector('table > tbody > tr:nth-child(1) > td:nth-child(1) > span');
    const testController = await page.$eval(
      'table > tbody > tr:nth-child(1) > td:nth-child(1) > span',
      elem => elem.innerHTML
    );
    expect(testController).toBe(
      mockControllers.sort((a, b) => a.results - b.results)[mockControllers.length - 1].controller
    );
  });

  test('should display 20 controllers in the table', async () => {
    await page.waitForSelector('div.pf-c-pagination.pf-m-bottom > div > div > button');
    await page.click('div.pf-c-pagination.pf-m-bottom > div > div > button');
    await page.waitForSelector(
      'div.pf-c-pagination.pf-m-bottom > div > ul > li:nth-child(1) > button'
    );
    await page.click('div.pf-c-pagination.pf-m-bottom > div > ul > li:nth-child(1) > button');
    const rows = await page.$$('tr');
    expect(rows.length - 1).toBe(20);
  });

  test('should display 50 controllers on preference', async () => {
    await page.waitForSelector('div.pf-c-pagination.pf-m-bottom > div > div > button');
    await page.click('div.pf-c-pagination.pf-m-bottom > div > div > button');
    await page.waitForSelector(
      'div.pf-c-pagination.pf-m-bottom > div > ul > li:nth-child(2) > button'
    );
    await page.click('div.pf-c-pagination.pf-m-bottom > div > ul > li:nth-child(2) > button');
    const rows = await page.$$('tr');
    expect(rows.length - 1).toBe(50);
  });

  test('should display 75 controllers on preference', async () => {
    await page.waitForSelector('div.pf-c-pagination.pf-m-bottom > div > div > button');
    await page.click('div.pf-c-pagination.pf-m-bottom > div > div > button');
    await page.waitForSelector(
      'div.pf-c-pagination.pf-m-bottom > div > ul > li:nth-child(3) > button'
    );
    await page.click('div.pf-c-pagination.pf-m-bottom > div > ul > li:nth-child(3) > button');
    const rows = await page.$$('tr');
    expect(rows.length - 1).toBe(75);
  });

  test('should display 100 controllers on preference', async () => {
    await page.waitForSelector('div.pf-c-pagination.pf-m-bottom > div > div > button');
    await page.click('div.pf-c-pagination.pf-m-bottom > div > div > button');
    await page.waitForSelector(
      'div.pf-c-pagination.pf-m-bottom > div > ul > li:nth-child(4) > button'
    );
    await page.click('div.pf-c-pagination.pf-m-bottom > div > ul > li:nth-child(4) > button');
    const rows = await page.$$('tr');
    expect(rows.length - 1).toBe(100);
  });

  test('should display the date picker component on click', async () => {
    await page.waitForSelector(
      '.pf-l-split__item:nth-child(1) > .pf-c-date-picker > .pf-c-date-picker__input > .pf-c-input-group > .pf-c-button > svg > path'
    );
    await page.click(
      '.pf-l-split__item:nth-child(1) > .pf-c-date-picker > .pf-c-date-picker__input > .pf-c-input-group > .pf-c-button > svg > path'
    );
  });

  test('should change the selected dates after picking them from the calendar', async () => {
    await page.waitForSelector(
      '.pf-l-split__item:nth-child(1) > .pf-c-date-picker > .pf-c-date-picker__input > .pf-c-input-group > .pf-c-button'
    );
    await page.click(
      '.pf-l-split__item:nth-child(1) > .pf-c-date-picker > .pf-c-date-picker__input > .pf-c-input-group > .pf-c-button'
    );

    await page.waitForSelector(
      '.pf-l-split__item:nth-child(3) > .pf-c-date-picker > .pf-c-date-picker__input > .pf-c-input-group > .pf-c-button > svg'
    );
    await page.click(
      '.pf-l-split__item:nth-child(3) > .pf-c-date-picker > .pf-c-date-picker__input > .pf-c-input-group > .pf-c-button > svg'
    );
  });
});
