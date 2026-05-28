const { Builder, By } = require('selenium-webdriver');
const path = require('path');

describe('Registration Form UI Tests', () => {
    jest.setTimeout(30000);
    let driver;

    beforeAll(async () => {
        const browser = process.env.BROWSER || 'MicrosoftEdge';
        const builder = new Builder().forBrowser(browser);

        if (browser.toLowerCase() === 'chrome') {
            const chrome = require('selenium-webdriver/chrome');
            const options = new chrome.Options();
            options.addArguments('--headless=new');
            options.addArguments('--disable-gpu');
            options.addArguments('--no-sandbox');
            options.addArguments('--disable-dev-shm-usage');
            builder.setChromeOptions(options);
        } else if (browser.toLowerCase() === 'microsoftedge') {
            const edge = require('selenium-webdriver/edge');
            const options = new edge.Options();
            options.addArguments('--headless=new');
            options.addArguments('--disable-gpu');
            options.addArguments('--no-sandbox');
            options.addArguments('--disable-dev-shm-usage');
            builder.setEdgeOptions(options);
        }

        driver = await builder.build();
        await driver.manage().window().setRect({ width: 1280, height: 1024 });
    });

    afterAll(async () => {
        if (driver) {
            await driver.quit();
        }
    });

    beforeEach(async () => {
        const filePath = path.resolve(__dirname, 'index.html');
        await driver.get(`file://${filePath}`);
    });

    test('should show validation errors when submitting an empty form', async () => {
        const submitBtn = await driver.findElement(By.id('submit-btn'));
        await submitBtn.click();

        // Check if error messages are displayed (parent has "invalid" class)
        const usernameGroup = await driver.findElement(By.css('#username')).findElement(By.xpath('..'));
        const emailGroup = await driver.findElement(By.css('#email')).findElement(By.xpath('..'));
        const passwordGroup = await driver.findElement(By.css('#password')).findElement(By.xpath('..'));

        expect(await usernameGroup.getAttribute('class')).toContain('invalid');
        expect(await emailGroup.getAttribute('class')).toContain('invalid');
        expect(await passwordGroup.getAttribute('class')).toContain('invalid');
    });

    test('should clear validation error on input', async () => {
        const submitBtn = await driver.findElement(By.id('submit-btn'));
        await submitBtn.click();

        const usernameInput = await driver.findElement(By.id('username'));
        const usernameGroup = await usernameInput.findElement(By.xpath('..'));

        expect(await usernameGroup.getAttribute('class')).toContain('invalid');

        // Type something
        await usernameInput.sendKeys('testuser');

        // Check if error class is removed
        expect(await usernameGroup.getAttribute('class')).not.toContain('invalid');
    });

    test('should fail validation with invalid email format', async () => {
        await driver.findElement(By.id('username')).sendKeys('JaneDoe');
        await driver.findElement(By.id('email')).sendKeys('invalid-email-format');
        await driver.findElement(By.id('password')).sendKeys('securepwd123');

        await driver.findElement(By.id('submit-btn')).click();

        const emailGroup = await driver.findElement(By.id('email')).findElement(By.xpath('..'));
        expect(await emailGroup.getAttribute('class')).toContain('invalid');

        const successAlert = await driver.findElement(By.id('success-alert'));
        expect(await successAlert.getAttribute('class')).toContain('hidden');
    });

    test('should successfully register with valid inputs', async () => {
        await driver.findElement(By.id('username')).sendKeys('JaneDoe');
        await driver.findElement(By.id('email')).sendKeys('jane.doe@example.com');
        await driver.findElement(By.id('password')).sendKeys('securepwd123');

        await driver.findElement(By.id('submit-btn')).click();

        // Form should be hidden
        const form = await driver.findElement(By.id('registration-form'));
        expect(await form.isDisplayed()).toBe(false);

        // Success alert should be visible (class does not contain 'hidden')
        const successAlert = await driver.findElement(By.id('success-alert'));
        expect(await successAlert.getAttribute('class')).not.toContain('hidden');
    });
});
