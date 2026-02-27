// tests/accountCreation.spec.ts
import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { AccountCreation } from "../pages/accountCreation";
import { ExcelHelper } from "../utils/ExcelHelper";
import { faker } from "@faker-js/faker";

test.describe("Validation of Account Creation", () => {
  const data  = ExcelHelper.getData("AccountCreation", "TCID02");
  test.beforeEach(async ({ page, baseURL }) => {
    const login = new LoginPage(page);
    await login.verifyLoginPage(baseURL!);
  });

  test("Account Creation Validation", async ({ page }) => {
    const accCreation = new AccountCreation(page);
    // Start Account Creation
    await expect(accCreation.accountText).toBeVisible();
    await accCreation.accountDropdown.click();
    await accCreation.clickNewAccount.click();

     // Company Info
    await expect(accCreation.newAccountPage).toBeVisible();
    await accCreation.enterCompanyName.fill(data.CompanyName);
    await accCreation.selectCountry();
    await accCreation.enterCityName.fill(data.City);
    await accCreation.selectState();
    await accCreation.enterZipCode.fill(String(data.ZipCode));
    await accCreation.clickSearchButton.click();

    // Duplicate Check
    await expect(accCreation.checkDuplicateOfCompnay).toBeVisible();
    await expect(accCreation.selectNewAccount).toBeVisible();
    await accCreation.selectNewAccount.hover();
    await accCreation.selectNewAccount.click();
    await accCreation.clickPerson.click();

    // Person Details
    await expect(accCreation.createNewAccText).toBeVisible();
    await accCreation.enterFirstName.fill(data.FirstName);
    await accCreation.enterLastName.fill(data.LastName);
    await accCreation.enterAddressLineOne.fill(faker.location.streetAddress());
    await accCreation.selectAddressType();
    await accCreation.enterOrganozation.fill(data.OrganizationName);
    await accCreation.clickOnSearch.click();
    await accCreation.clickOnUpdate.click();

    // Validate Account Created
    await accCreation.validateAccountCreated();
  });
});