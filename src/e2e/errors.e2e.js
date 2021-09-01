import puppeteer from 'puppeteer';

jest.setTimeout(30000);

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  });
  page = await browser.newPage();
  await page.goto('http://localhost:8000/dashboard');
});

afterAll(() => {
  browser.close();
});

describe('error handler component', () => {
  test('should display error alert on a invalid login', async () => {
    await page.waitForSelector(
      '.pf-c-page > .pf-c-page__header > .pf-c-page__header-tools > .pf-c-page__header-tools-group > .pf-c-button'
    );
    await page.click(
      '.pf-c-page > .pf-c-page__header > .pf-c-page__header-tools > .pf-c-page__header-tools-group > .pf-c-button'
    );

    await page.waitForSelector(
      '.pf-l-grid__item > .pf-l-grid > .pf-l-grid__item > .pf-c-button > .pf-c-title'
    );
    await page.click(
      '.pf-l-grid__item > .pf-l-grid > .pf-l-grid__item > .pf-c-button > .pf-c-title'
    );

    await page.waitForSelector('#horizontal-form-name');
    await page.click('#horizontal-form-name');

    await page.type('#horizontal-form-name', 'admin@admin.com');
    await page.type('#horizontal-form-password', 'randompwd');

    await page.click('#submitBtn');

    await page.waitForSelector('.pf-c-alert.pf-m-danger', { visible: true });
  });

  test('should close the alert', async () => {
    await page.waitForSelector('.pf-c-alert', { visible: true });
    await page.waitForSelector('li > .pf-c-alert > .pf-c-alert__action > .pf-c-button > svg');

    await page.click('li > .pf-c-alert > .pf-c-alert__action > .pf-c-button > svg');
    const alert = await page.$('.pf-c-alert');
    expect(alert).toBe(null);
  });
});
