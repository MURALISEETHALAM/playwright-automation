import { Page, Locator, expect } from "@playwright/test";
import { ExcelHelper } from "../utils/ExcelHelper";

export class AccountCreation {
  readonly page: Page;

  readonly accountText: Locator;
  readonly accountDropdown: Locator;
  readonly clickNewAccount: Locator;
  readonly newAccountPage: Locator;
  readonly enterCompanyName: Locator;
  readonly countryDropdown: Locator;
  readonly enterCityName: Locator;
  readonly stateDropdown: Locator;
  readonly enterZipCode: Locator;
  readonly clickSearchButton: Locator;
  readonly checkDuplicateOfCompnay: Locator;
  readonly selectNewAccount: Locator;
  readonly clickPerson: Locator;

  // Confirm account information Page
  readonly createNewAccText: Locator;
  readonly enterFirstName: Locator;
  readonly enterLastName: Locator;
  readonly enterAddressLineOne: Locator;
  readonly addressType: Locator;
  readonly enterOrganozation: Locator;
  readonly clickOnSearch: Locator;
  readonly clickOnUpdate: Locator;
  readonly accountNumber: Locator;
  readonly inputAccNumber: Locator;
  readonly clickOnAccSearch: Locator;

// New Submission Draft State
readonly clickOnNewSubmission: Locator;
readonly selectBusinessowners: Locator;
readonly Offerings: Locator;
readonly qualification: Locator;
readonly policyInfo: Locator;
readonly orgDropDown: Locator;
readonly businessownersLine: Locator;
readonly selectSmallBusinessDropDown: Locator;
readonly locations: Locator;
readonly buildings: Locator;
readonly modifiers: Locator;
readonly riskAnalysis: Locator;
readonly policyReview: Locator;
readonly clickOnSaveDraft: Locator;
readonly clikcOnNextButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.accountText = page.getByLabel("Account", { exact: true });
    this.accountDropdown = page.locator(
      "#TabBar-AccountTab .gw-action--expand-button",
    );
    this.clickNewAccount = page.getByRole("menuitem", { name: "New Account" });
    this.newAccountPage = page.getByRole("heading", {
      name: "Enter Account Information",
    });
    this.enterCompanyName = page.locator('input[name$="Name"]').first();
    this.countryDropdown = page.locator('select[name$="Country"]');
    this.enterCityName = page.locator('input[name$="City"]');
    this.stateDropdown = page.locator('select[name$="State"]');
    this.enterZipCode = page.locator('input[name$="PostalCode"]');
    this.clickSearchButton = page.getByRole("link", { name: "Search" });
    this.checkDuplicateOfCompnay = page.getByRole("heading", {
      name: "Information for the current",
    });
    this.selectNewAccount = page.getByText("Create New Account");
    this.clickPerson = page.getByLabel("Person", { exact: true });

    // Confirm account information Page
    this.createNewAccText = page.getByRole("heading", {
      name: "Create account",
    });
    this.enterFirstName = page.locator('input[name$="FirstName"]');
    this.enterLastName = page.locator('input[name$="LastName"]');
    this.enterAddressLineOne = page.locator('input[name$="AddressLine1"]');
    this.addressType = page.locator('select[name$="AddressType"]');
    this.enterOrganozation = page.locator('input[name$="Producer"]');
    this.clickOnSearch = page.getByRole("button", {
      name: "Select Organization...",
    });
    this.clickOnUpdate = page.getByRole("button", { name: "Update" });
    this.accountNumber = page
      .getByRole("group", { name: "Account No" })
      .locator(".gw-value-readonly-wrapper");
    this.inputAccNumber = page.locator(
      'input[name$="AccountNumberSearchItem"]',
    );
    this.clickOnAccSearch = page.getByRole("button", {
      name: "gw-search-icon",
    });

// New Submission Draft State
   this.clickOnNewSubmission = page.getByRole('button', { name: 'New Submission' });
   this.selectBusinessowners = page.getByRole('link', { name: 'Select' }).first();
   this.Offerings = page.getByRole('heading', { name: 'Offerings' });
   this.qualification = page.getByRole('heading', { name: 'Qualification', exact: true });
   this.policyInfo = page.getByRole('heading', { name: 'Policy Info' });
   this.orgDropDown = page.locator('select[name$="OrganizationType"]');
   this.businessownersLine = page.getByRole('heading', { name: 'Businessowners Line' });
   this.selectSmallBusinessDropDown = page.locator('select[name$="SmallBusinessType"]');
   this.locations = page.getByRole('heading', { name: 'Locations' });
   this.buildings = page.getByRole('heading', { name: 'Buildings' });
   this.modifiers = page.getByRole('heading', { name: 'Modifiers' });
   this.riskAnalysis = page.getByRole('heading', { name: 'Risk Analysis' });
   this.policyReview = page.getByRole('heading', { name: 'Policy Review' });
   this.clickOnSaveDraft = page.getByRole('button', { name: 'Save Draft' });
   this.clikcOnNextButton = page.getByRole('button', { name: 'Next' });
   
   
  }


  async selectCountry() {
    await this.countryDropdown.selectOption("US");
  }
  async selectState() {
    await this.stateDropdown.selectOption("AL");
  }
  async selectAddressType() {
    await this.addressType.selectOption("billing");
  }
   async selectOrgType() {
    await this.orgDropDown.selectOption("llp");
  }
  async selectSmallBusinessType() {
    await this.selectSmallBusinessDropDown.selectOption("apartment");
  }

  // Validating of Account Creation
  async validateAccountCreated() {
    await this.accountNumber.waitFor({ state: "visible" });
    const getAccNumber = (await this.accountNumber.textContent())?.trim() ?? "";
    console.log(getAccNumber);
    await this.accountDropdown.click();
    await this.inputAccNumber.fill(getAccNumber);
    await this.clickOnAccSearch.click();
    const actualAccNo = (await this.accountNumber.textContent())?.trim() ?? "";
    expect(actualAccNo).toBe(getAccNumber);
  //  Write to Excel
  ExcelHelper.writeData("AccountCreation", "TCID01", "AccountNumber", getAccNumber);

  }
}
