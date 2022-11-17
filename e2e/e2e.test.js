const session = require('../session.json')

describe("./pages/DashBoard", () => {

  it("open maxsolo with welcome screen", async () => {
    await page.goto(session.APP_PAGE_URL);
    
    await page.waitForSelector(".app");
    await page.waitForSelector('[data-testid="welcome-logo"]',{hidden: true});
    await page.waitForSelector(".welcome-button .minima-btn:first-child",{visible: true});

    const text = await page.$eval(".welcome-button .minima-btn:first-child", (e) => e.textContent);
    expect(text).toContain("Start chatting");

    await page.click('[data-testid="start-chat-button"]');

  });
  it("send a text message to another user", async () => {
    await page.waitForSelector(".maxsolo-sidebar-contacts",{visible: true});
    await page.click(".contact:nth-child(1)");

    await page.waitForSelector(".maxsolo-chat-area-main",{visible: true});
    await page.waitForSelector(".chat-area-footer",{visible: true});
    
    await page.waitForSelector('[data-testid="input-text"]');

    await page.click('[data-testid="input-text"]');
    await page.type('[data-testid="input-text"]', "Hello World");

    await page.click('.form-send');

    await new Promise(resolve => setTimeout(resolve, 1000));

    const text = await page.$eval(".contact:nth-child(1) .contact-message", (e) => e.textContent);
    expect(text).toContain("Hello World");
  });
  it("send an image to another user", async () => {

    await page.waitForSelector(".chat-area-footer-menu");
    await page.click('form > svg:nth-child(1)');
    await page.waitForSelector(".chat-area-footer-menu");

    await page.click('div.chat-area-footer > div > div:nth-child(3)');
    
    const fileInput = await page.$('#file-input');
    await fileInput.uploadFile("../src/assets/images/maxsolo_welcome.png");
    await new Promise(resolve => setTimeout(resolve, 1000));

    await page.click('.form-send');
    await new Promise(resolve => setTimeout(resolve, 3000));
  });
  it("send a text and image to another user", async () => {

    await page.waitForSelector(".chat-area-footer-menu");
    await page.click('form > svg:nth-child(1)');
    await page.waitForSelector(".chat-area-footer-menu");

    await page.click('div.chat-area-footer > div > div:nth-child(3)');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const fileInput = await page.$('#file-input');
    await fileInput.uploadFile("../src/assets/images/maxsolo_welcome_1.png");
    await new Promise(resolve => setTimeout(resolve, 2000));

    await page.click('[data-testid="input-text"]');
    await page.type('[data-testid="input-text"]', "Sending text and image");

    await page.click('.form-send');
    await new Promise(resolve => setTimeout(resolve, 3000));

    await page.click(".contact:nth-child(1)");

    const text = await page.$eval(".contact:nth-child(1) .contact-message", (e) => e.textContent);
    expect(text).toContain("Sending text and image");
  });
  it("user can see token balance on send token page", async () => {

    await page.waitForSelector(".chat-area-footer-menu");
    await page.click('form > svg:nth-child(1)');

    await page.click('div.chat-area-footer > div > div:nth-child(2)');
    await new Promise(resolve => setTimeout(resolve, 1000));

    await page.waitForSelector(".send-tokens-window-balance");

    await page.waitForSelector(".token-name");

  });

  it("user can send tokens to another user", async () => {

    
    await page.click('.close-window');
    await new Promise(resolve => setTimeout(resolve, 1000));

    await page.waitForSelector(".chat-area-footer-menu");
    await page.click('form > svg:nth-child(1)');

    await page.click('div.chat-area-footer > div > div:nth-child(2)');
    await new Promise(resolve => setTimeout(resolve, 1000));

    await page.waitForSelector(".send-tokens-window-balance");

    await page.click('.send-tokens-window-balance > div:nth-child(2)');
    await new Promise(resolve => setTimeout(resolve, 1000));

    await page.click('.send-tokens-window-balance > div:nth-child(1)');
    await new Promise(resolve => setTimeout(resolve, 1000));

    await page.click('div.send-tokens-window-number > input[type=number]');
    await page.type('div.send-tokens-window-number > input[type=number]', "0.00246");
    await new Promise(resolve => setTimeout(resolve, 2000));

    await page.click('div.send-tokens-window > button.minima-btn.btn-fill-blue-medium');

    await page.waitForSelector(".send-tokens-window-success");
    await new Promise(resolve => setTimeout(resolve, 3000));

    await page.click('div.send-tokens-window-success > button');
    await new Promise(resolve => setTimeout(resolve, 2000));

    const text = await page.$eval(".contact:nth-child(1) .contact-message", (e) => e.textContent);
    expect(text).toContain("I just sent you 0.00246 Minima");

  });
  it("copy and share user's Maxima address", async () => {

    await page.waitForSelector(".maxsolo-sidebar-contacts",{visible: true});
    await page.click(".contact:nth-child(1)");

    await page.waitForSelector(".maxsolo-chat-area-main",{visible: true});

    await page.waitForSelector(".header-right-button");

    await page.click('.header-right-button');

    await new Promise(resolve => setTimeout(resolve, 1000));

    await page.waitForSelector(".header-dropdown.show");

    await page.waitForSelector(".header-dropdown > ul > li:nth-child(2)");

    await new Promise(resolve => setTimeout(resolve, 1000));

    await page.click(".header-dropdown > ul > li:nth-child(2)");
    await new Promise(resolve => setTimeout(resolve, 4000));

    await page.waitForSelector("div.maxsolo-sidebar-notification-content > span");

  });
  it("delete another user messages from the chat window", async () => {

    await page.waitForSelector(".maxsolo-sidebar-contacts",{visible: true});
    await page.click(".contact:nth-child(1)");

    await page.waitForSelector(".maxsolo-chat-area-main",{visible: true});

    await page.waitForSelector(".chat-msg");

    await page.waitForSelector(".header-right-button");

    await page.click('.header-right-button');

    await new Promise(resolve => setTimeout(resolve, 1000));

    await page.waitForSelector(".header-dropdown.show");

    await page.waitForSelector(".header-dropdown > ul > li:nth-child(1)");

    await new Promise(resolve => setTimeout(resolve, 1000));

    await page.click(".header-dropdown > ul > li:nth-child(1)");
    await new Promise(resolve => setTimeout(resolve, 2000));

    // No chat messages anymore
    await expect(page.$('.chat-msg')).resolves.toBeFalsy();

    await page.waitForSelector("div.maxsolo-sidebar-notification-content > span");

  });
  it("to share my maxima contact", async () => {
    await page.waitForSelector(".header-menu",{visible: true});
    await page.click(".header-menu");
    await new Promise(resolve => setTimeout(resolve, 2000));

    await page.waitForSelector(".maxsolo-sidebar-menu.open");
    await new Promise(resolve => setTimeout(resolve, 2000));

    await page.waitForSelector("#root > div > main > div > div.maxsolo-sidebar.mobile > div.maxsolo-sidebar-menu.open > ul > li:nth-child(4)");

    await page.click("#root > div > main > div > div.maxsolo-sidebar.mobile > div.maxsolo-sidebar-menu.open > ul > li:nth-child(4) > div.maxsolo-sidebar-menu-item-tab");

    await page.click("#root > div > main > div > div.maxsolo-sidebar.mobile > div.maxsolo-sidebar-menu.open > ul > li:nth-child(4) > div.maxsolo-sidebar-menu-item-container.active > form > div > button");

    await page.waitForSelector("div.maxsolo-sidebar-menu.open > div.maxsolo-sidebar-notification.slideIn.info > div.maxsolo-sidebar-notification-content > span");
    await new Promise(resolve => setTimeout(resolve, 1000));

    const text = await page.$eval("div.maxsolo-sidebar-menu.open > div.maxsolo-sidebar-notification.slideIn.info > div.maxsolo-sidebar-notification-content > span", (e) => e.textContent);
    expect(text).toContain("Your Maxima contact copied.");
  });

  it("add maxima contact", async () => {

    await page.waitForSelector("#root > div > main > div > div.maxsolo-sidebar.mobile > div.maxsolo-sidebar-menu.open > ul > li:nth-child(1) > div.maxsolo-sidebar-menu-item-tab");

    await page.click("#root > div > main > div > div.maxsolo-sidebar.mobile > div.maxsolo-sidebar-menu.open > ul > li:nth-child(1) > div.maxsolo-sidebar-menu-item-tab");

    const input= page.waitForSelector('#root > div > main > div > div.maxsolo-sidebar.mobile > div.maxsolo-sidebar-menu.open > ul > li:nth-child(1) > div.maxsolo-sidebar-menu-item-container.active > form > textarea')

    const el = await page.$('#root > div > main > div > div.maxsolo-sidebar.mobile > div.maxsolo-sidebar-menu.open > ul > li:nth-child(4) > div.maxsolo-sidebar-menu-item-container > form > textarea');
    const maximaAddress = await page.evaluate(el => el.value, el);

    await page.type('#root > div > main > div > div.maxsolo-sidebar.mobile > div.maxsolo-sidebar-menu.open > ul > li:nth-child(1) > div.maxsolo-sidebar-menu-item-container.active > form > textarea', maximaAddress, {delay: 0.01});
    await new Promise(resolve => setTimeout(resolve, 1000));

    await page.click("#root > div > main > div > div.maxsolo-sidebar.mobile > div.maxsolo-sidebar-menu.open > ul > li:nth-child(1) > div.maxsolo-sidebar-menu-item-container.active > form > div > button");

    await page.waitForSelector("div.maxsolo-sidebar-menu.open > div.maxsolo-sidebar-notification.slideIn.info > div.maxsolo-sidebar-notification-content > span");
    await new Promise(resolve => setTimeout(resolve, 1000));

    const text = await page.$eval("div.maxsolo-sidebar-menu.open > div.maxsolo-sidebar-notification.slideIn.info > div.maxsolo-sidebar-notification-content > span", (e) => e.textContent);
    expect(text).toContain("Contact created.");
  });

  it("set profile name", async () => {

    await page.waitForSelector("#root > div > main > div > div.maxsolo-sidebar.mobile > div.maxsolo-sidebar-menu.open > ul > li:nth-child(3) > div.maxsolo-sidebar-menu-item-tab");

    await page.click("#root > div > main > div > div.maxsolo-sidebar.mobile > div.maxsolo-sidebar-menu.open > ul > li:nth-child(3) > div.maxsolo-sidebar-menu-item-tab");

    await page.click('#root > div > main > div > div.maxsolo-sidebar.mobile > div.maxsolo-sidebar-menu.open > ul > li:nth-child(3) > div.maxsolo-sidebar-menu-item-container.active > form > textarea');
    await page.type('#root > div > main > div > div.maxsolo-sidebar.mobile > div.maxsolo-sidebar-menu.open > ul > li:nth-child(3) > div.maxsolo-sidebar-menu-item-container.active > form > textarea', "NewProfileName");
    await new Promise(resolve => setTimeout(resolve, 1000));

    await page.click("#root > div > main > div > div.maxsolo-sidebar.mobile > div.maxsolo-sidebar-menu.open > ul > li:nth-child(3) > div.maxsolo-sidebar-menu-item-container.active > form > div > button");

    await page.waitForSelector("div.maxsolo-sidebar-menu.open > div.maxsolo-sidebar-notification.slideIn.info > div.maxsolo-sidebar-notification-content > span");
    await new Promise(resolve => setTimeout(resolve, 2000));

    const text = await page.$eval("div.maxsolo-sidebar-menu.open > div.maxsolo-sidebar-notification.slideIn.info > div.maxsolo-sidebar-notification-content > span", (e) => e.textContent);
    expect(text).toContain("Profile name updated.");
    await new Promise(resolve => setTimeout(resolve, 3000));
  });
  it("delete contact", async () => {

    await page.waitForSelector("#root > div > main > div > div.maxsolo-sidebar.mobile > div.maxsolo-sidebar-menu.open > ul > li:nth-child(2) > div.maxsolo-sidebar-menu-item-tab");

    await page.click("#root > div > main > div > div.maxsolo-sidebar.mobile > div.maxsolo-sidebar-menu.open > ul > li:nth-child(2) > div.maxsolo-sidebar-menu-item-tab");

    await new Promise(resolve => setTimeout(resolve, 1000));

    await page.click("div.maxsolo-sidebar-menu-item-container > div:nth-child(9) > div.contact-list-item-but-del");
    
    await page.waitForSelector("div.maxsolo-sidebar-menu.open > div.maxsolo-sidebar-notification.slideIn.info > div.maxsolo-sidebar-notification-content > span");
    await new Promise(resolve => setTimeout(resolve, 2000));

    const text = await page.$eval("div.maxsolo-sidebar-menu.open > div.maxsolo-sidebar-notification.slideIn.info > div.maxsolo-sidebar-notification-content > span", (e) => e.textContent);
    expect(text).toContain("Contact & messages deleted.");
    await new Promise(resolve => setTimeout(resolve, 1000));

    await page.click(".header-menu");
    await new Promise(resolve => setTimeout(resolve, 6000));
  });
  it("switch between dark and light modes", async () => {

    await page.click(".header-menu");
    await new Promise(resolve => setTimeout(resolve, 2000));

    await page.click("#root > div > main > div > div.maxsolo-sidebar > div.maxsolo-sidebar-menu.open > ul > li.maxsolo-sidebar-menu-item-tab.my_switcher.header-options > button");
    await new Promise(resolve => setTimeout(resolve, 2000));

  });
  
  // afterAll(() => browser.close());
});
jest.setTimeout(105000);