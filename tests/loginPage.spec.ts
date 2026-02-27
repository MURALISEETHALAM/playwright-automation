import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";


test("Verifying Login Page", async ({ page, baseURL}) => {
  const login = new LoginPage(page);
   await login.verifyLoginPage(baseURL!);
});
