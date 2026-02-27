import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;

  readonly enterUsername: Locator;
  readonly enterpassword: Locator;
  readonly usernameText: Locator;
  readonly passwordText: Locator;
  readonly loginButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.enterUsername = page.locator(
      'input[name="Login-LoginScreen-LoginDV-username"]',
    );
    this.enterpassword = page.locator(
      'input[name="Login-LoginScreen-LoginDV-password"]',
    );
    this.usernameText = page.getByText("Username", { exact: true });
    this.passwordText = page.getByText("Password", { exact: true });
    this.loginButton = page.getByRole("button", { name: "Log In" });
    this.successMessage = page.getByRole("heading", { name: "My Summary" });
  }

  async verifyLoginPage(baseURL: string) {
    await this.page.goto(baseURL);
    await expect(this.usernameText).toBeVisible();
    await expect(this.passwordText).toBeVisible();
    await this.enterUsername.fill(process.env.USERNAMES!);
    await this.enterpassword.fill(process.env.PASSWORD!);
    await this.loginButton.click();
    await expect(this.page).toHaveURL(/PolicyCenter.do/);
    await expect(this.successMessage).toBeVisible();
  }
}
