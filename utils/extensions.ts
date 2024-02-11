import {
  APIRequestContext,
  BrowserContext,
  test as base,
} from "@playwright/test"
import { settings } from "./settings"

type MyFixtures = {
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
