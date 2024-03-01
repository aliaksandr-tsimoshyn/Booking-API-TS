import {
  APIRequestContext,
  test as base,
} from "@playwright/test"
import { settings } from "./settings"
import { Users } from "./helpers/users"

type MyFixtures = {
  authorizedRequest: APIRequestContext
  users: Users
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

  users: async ({ authorizedRequest }, use) => {
    await use(new Users(authorizedRequest))
  },

  // invalidUser: {
  //   username: "invalid_username",
  //   password: "invalid_password",
  // },
})
