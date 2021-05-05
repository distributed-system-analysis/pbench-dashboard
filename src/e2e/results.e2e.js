import puppeteer from 'puppeteer';
import { mockControllers, mockIndices, mockResults } from '../../mock/api';

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
  test('should load controllers', async () => {
    await page.waitForSelector('table > tbody > tr:nth-child(1) > td:nth-child(1) > span');
    const testController = await page.$eval(
      'table > tbody > tr:nth-child(1) > td:nth-child(1) > span',
      elem => elem.innerHTML
    );
    expect(testController).toBe(mockControllers[0].controller);
  });

  test('should navigate to result', async () => {
    await page.waitForSelector('table > tbody > tr:nth-child(1) > td:nth-child(1) > span');
    const testController = await page.$eval(
      'table > tbody > tr:nth-child(1) > td:nth-child(1) > span',
      elem => elem.innerHTML
    );
    await page.click('table > tbody > tr:nth-child(1) > td:nth-child(1) > span');
    await page.waitForSelector('section.pf-c-page__main-section.pf-m-light > div > h1');
    const pageHeader = await page.$eval(
      'section.pf-c-page__main-section.pf-m-light > div > h1',
      elem => elem.innerHTML
    );
    expect(pageHeader).toBe(testController);
  });
});
