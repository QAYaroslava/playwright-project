import { test, expect, request } from '@playwright/test';

test.describe('Creating car', () => {
  
  let apiContext;
  

  test.beforeAll(async ({ browser }) => {

    const guestContext = await browser.newContext({
      httpCredentials: { username: 'guest', password: 'welcome2qauto', send: 'always' },
    });
    const guestPage = await guestContext.newPage();
    await guestPage.goto('https://qauto.forstudy.space');
  
    const guestCookies = await guestContext.cookies();
    const guestCookiesParsed = guestCookies.reduce((acc, curr) => `${acc}${curr.name}=${curr.value}; `, '');

    const userContext = await browser.newContext();
    const userPage = await userContext.newPage();
    await userPage.goto('https://qauto.forstudy.space');
    await userPage.click('button:has-text("Sign in")');
    await userPage.fill('input[name="email"]', 'yarakucherenko07@gmail.com');
    await userPage.fill('input[name="password"]', 'Qwerty123');
    await userPage.click('button:has-text("Login")');
  
    await expect(userPage).toHaveURL('https://qauto.forstudy.space/panel/garage');
  
    const userCookies = await userContext.cookies();
    const userCookiesParsed = userCookies.reduce((acc, curr) => `${acc}${curr.name}=${curr.value}; `, '');
  
    apiContext = await request.newContext({
      baseURL: 'https://qauto.forstudy.space/api',
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        Cookie: userCookiesParsed,
      },
    });
  });

  test('Positive case: Successfully create a car', async () => {
    const response = await apiContext.post('/cars', {
      data: {
        carBrandId: 1,
        carModelId: 1,
        mileage: 122,
      },
    });

    expect(response.status()).toBe(201);

    const responseBody = await response.json();
    expect(responseBody).toMatchObject({
      status: 'ok',
      data: {
        carBrandId: 1,
        carModelId: 1,
        mileage: 122,
      },
    });
  });

  test('Negative case: Missing carBrandId', async () => {
    const response = await apiContext.post('/cars', {
      data: {
        carModelId: 1,
        mileage: 122,
      },
    });

    expect(response.status()).toBe(400);

    const responseBody = await response.json();
    expect(responseBody).toMatchObject({
      status: 'error',
      message: 'carBrandId is required',
    });
  });

  test('Negative case: Invalid data in body', async () => {
    const response = await apiContext.post('/cars', {
      data: {
        carBrandId: 1,
        carModelId: 1,
        mileage: 'one hundred',
      },
    });

    expect(response.status()).toBe(400);

    const responseBody = await response.json();
    expect(responseBody).toMatchObject({
      status: 'error',
      message: 'mileage must be a number',
    });
  });

  test.afterAll(async () => {
    if (apiContext) {
      await apiContext.dispose();
    }
  });
});