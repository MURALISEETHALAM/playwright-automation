import { test, expect, BrowserContext, Page } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { AccountCreation } from "../pages/accountCreation";
import { ExcelHelper } from '../utils/ExcelHelper';

test.describe("Validation of Account Creation", () => {
  const data  = ExcelHelper.getData("AccountCreation", "TCID01");
  test.beforeEach(async ({ page, baseURL }) => {
    const login = new LoginPage(page);
    await login.verifyLoginPage(baseURL!);
  });

  test("New Submission in Draft State",  async ({ page }) => {
    const accCreation = new AccountCreation(page);
    await expect(accCreation.accountText).toBeVisible();
    await accCreation.accountDropdown.click();
    await accCreation.inputAccNumber.fill(data.AccountNumber);
    await accCreation.clickOnAccSearch.click();
    await expect(accCreation.accountText).toBeVisible();
    await expect(accCreation.clickOnNewSubmission).toBeVisible();
    await accCreation.clickOnNewSubmission.click();
    await accCreation.selectBusinessowners.click();
    await expect(accCreation.Offerings).toBeVisible();
    await accCreation.clikcOnNextButton.click();
    await expect(accCreation.qualification).toBeVisible();
    await accCreation.clikcOnNextButton.click();
    await expect(accCreation.policyInfo).toBeVisible();
    await accCreation.selectOrgType();
    await accCreation.clikcOnNextButton.click();
    await expect(accCreation.businessownersLine).toBeVisible();
    await accCreation.selectSmallBusinessType();
    await accCreation.clikcOnNextButton.click();
    await expect(accCreation.locations).toBeVisible();
    await accCreation.clikcOnNextButton.click();
    await expect(accCreation.buildings).toBeVisible();
    await accCreation.clikcOnNextButton.click();
    await expect(accCreation.modifiers).toBeVisible();
    await accCreation.clikcOnNextButton.click();
    await expect(accCreation.riskAnalysis).toBeVisible();
    await accCreation.clikcOnNextButton.click();
    await expect(accCreation.policyReview).toBeVisible();
    await accCreation.clickOnSaveDraft.hover();
    await accCreation.clickOnSaveDraft.click();
  });
});