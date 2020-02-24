import puppeteer from 'puppeteer';
import { mockStore } from '../../mock/api';

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    args: ['--no-sandbox'],
  });
  page = await browser.newPage();
  await page.goto('http://localhost:8000/dashboard/#/');
  // Login using dummy credentials
  const loginForm = await page.$('.login-form');
  // If login-form is visible, it means user
  // is not logged in yet
  if (loginForm) {
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
    await page.waitForSelector(
      '.pf-l-grid__item > .pf-c-form > .pf-c-form__group > .pf-c-form__actions > .pf-c-button'
    );
    await page.click(
      '.pf-l-grid__item > .pf-c-form > .pf-c-form__group > .pf-c-form__actions > .pf-c-button'
    );
  }
  // Intercept network requests
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (request.method() === 'POST' && request.postData().includes('url')) {
      request.respond({
        status: 200,
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(mockStore),
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
  test('should generate user session', async () => {
    await page.waitForSelector('.anticon-share-alt > svg');
    await page.click('.anticon-share-alt > svg');

    await page.waitForSelector('.ant-input');
    await page.type('.ant-input', 'controller page test', { delay: 50 });

    await page.waitForSelector(
      '.ant-modal-wrap > .ant-modal > .ant-modal-content > .ant-modal-footer > .ant-btn-primary'
    );
    await page.click(
      '.ant-modal-wrap > .ant-modal > .ant-modal-content > .ant-modal-footer > .ant-btn-primary'
    );
  });

  test('should copy session link', async () => {
    await page.waitForSelector('.ant-btn');
    await page.click('.ant-btn');
  });
});
