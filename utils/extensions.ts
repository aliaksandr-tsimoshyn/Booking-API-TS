import {
  APIRequestContext,
  BrowserContext,
  test as base,
} from "@playwright/test"
import { settings } from "./settings"
import { LoginPage } from "../page-objects/login-page"
import { MainPage } from "../page-objects/main-page"

type MyFixtures = {
  loginPage: LoginPage
  mainPage: MainPage
  authorizedMainPage: MainPage
  authorizedRequest: APIRequestContext
  authorizedContext: BrowserContext
  invalidUser: User
}

type User = {
  firstName: string
  lastName: string
  email: string
  password: string
}

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page))
  },

  mainPage: async ({ page }, use) => {
    await use(new MainPage(page))
  },

  authorizedMainPage: async ({ page }, use) => {
    let authorizedContext = settings.authorizedContext as BrowserContext
    page = await authorizedContext.newPage()
    await use(new MainPage(page))
  },

  authorizedRequest: async ({}, use) => {
    let authorizedRequest = settings.authorizedRequest
    await use(authorizedRequest as APIRequestContext)
  },

  authorizedContext: async ({}, use) => {
    let authorizedContext = settings.authorizedContext
    await use(authorizedContext as BrowserContext)
  },

  invalidUser: {
    firstName: "Invalid",
    lastName: "User",
    email: "invalid.email",
    password: "invalid_password",
  },
})
