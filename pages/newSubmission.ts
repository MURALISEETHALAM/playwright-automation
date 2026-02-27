import { Page, Locator, expect } from "@playwright/test";
import { read } from "node:fs";

export class AccountCreation {
  readonly page: Page;

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
   async selectOrgType() {
    await this.orgDropDown.selectOption("llp");
  }
  async selectSmallBusinessType() {
    await this.selectSmallBusinessDropDown.selectOption("apartment");
  }
}
