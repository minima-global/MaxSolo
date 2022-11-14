// import puppeteer from "puppeteer";
// import session from "../session.json";
const session = require('../session.json')

describe("./pages/DashBoard", () => {
  // let browser;
  // let page;

  // beforeAll(async () => {
  //   browser = await puppeteer.launch({ headless: false });
  //   // browser = await puppeteer.launch();
  //   page = await browser.newPage();
  // });
  it("open maxsolo", async () => {
    await page.goto(session.APP_PAGE_URL);
    await page.waitForSelector(".app");

    await page.waitForSelector(".welcome-button .minima-btn:first-child",{visible: true});


    const text = await page.$eval(".welcome-button .minima-btn:first-child", (e) => e.textContent);
    expect(text).toContain("Start chatting");
    console.log("1");
    await page.click('[data-testid="startchat"]');
    await new Promise(resolve => setTimeout(resolve, 20000));


    // await page.waitForSelector(".welcome-contacts");
   

    // await page.waitForSelector(".maxsolo-sidebar-contacts");


    // await page.click(".contact");
    // await page.waitForSelector(".App-welcome-text");
    // const text = await page.$eval(".App-welcome-text", (e) => e.textContent);
    // expect(text).toContain("This is the about page.");
  });
  // afterAll(() => browser.close());
});