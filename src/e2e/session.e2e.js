import puppeteer from 'puppeteer';
import { mockControllers, mockIndices, mockSession } from '../../mock/api';

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
    if (request.method() === 'POST' && request.postData().includes('createSession')) {
      request.respond({
        status: 200,
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(mockSession),
      });
    } else if (request.method() === 'POST' && request.url().includes('/controllers/list')) {
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

describe('session flow', () => {
  test('should load controllers', async () => {
    await page.waitForSelector('table > tbody > tr:nth-child(1) > td:nth-child(1) > span');
    const testController = await page.$eval(
      'table > tbody > tr:nth-child(1) > td:nth-child(1) > span',
      elem => elem.innerHTML
    );
    expect(testController).toBe(mockControllers[0].controller);
  });

  test('should generate user session', async () => {
    await page.waitForSelector('span > .pf-c-toolbar__item > .pf-c-button > svg > path');
    await page.click('span > .pf-c-toolbar__item > .pf-c-button > svg > path');

    await page.waitForSelector('#pf-modal-part-2 #description');
    await page.click('#pf-modal-part-2 #description');

    await page.waitForSelector(
      '.pf-c-backdrop > .pf-l-bullseye > #pf-modal-part-0 > .pf-c-modal-box__footer > .pf-m-primary'
    );
    await page.click(
      '.pf-c-backdrop > .pf-l-bullseye > #pf-modal-part-0 > .pf-c-modal-box__footer > .pf-m-primary'
    );
  });

  test('should copy session link', async () => {
    await page.waitForSelector(
      '.pf-l-bullseye > #pf-modal-part-1 > #pf-modal-part-3 > div > .pf-c-button'
    );
    await page.click('.pf-l-bullseye > #pf-modal-part-1 > #pf-modal-part-3 > div > .pf-c-button');
  });
});
