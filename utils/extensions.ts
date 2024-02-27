import {
  APIRequestContext,
  test as base,
} from "@playwright/test"
import { settings } from "./settings"

type MyFixtures = {
  authorizedRequest: APIRequestContext
  // invalidUser: User
}

// type User = {
//   username: string
//   password: string
// }

export const test = base.extend<MyFixtures>({

  authorizedRequest: async ({}, use) => {
    let authorizedRequest = settings.authorizedRequest
    await use(authorizedRequest as APIRequestContext)
  },

  // invalidUser: {
  //   username: "invalid_username",
  //   password: "invalid_password",
  // },
})
