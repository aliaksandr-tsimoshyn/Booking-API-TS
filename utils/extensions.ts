import {
  APIRequestContext,
  test as base,
} from "@playwright/test"
import { settings } from "./settings"
import { Users } from "./helpers/users"
import { Flights } from "./helpers/flights"
import { User } from "./interfaces"

type MyFixtures = {
  authorizedRequest: APIRequestContext
  users: Users
  flights: Flights
  newUser: User
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

  newUser: async ({ users }, use) => {
    const newUser = await users.createUser('admin')
    await use(newUser)
    await users.deleteUser(newUser.user_id as string)
  },

  flights: async ({ authorizedRequest }, use) => {
    await use(new Flights(authorizedRequest))
  },

  // invalidUser: {
  //   username: "invalid_username",
  //   password: "invalid_password",
  // },
})
