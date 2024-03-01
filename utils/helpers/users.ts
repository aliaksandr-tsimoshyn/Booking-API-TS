import { APIRequestContext, expect, request } from "@playwright/test"
import { settings } from "../settings"
import { User } from "../interfaces"
import { createRandomString } from "./general"

export class Users {
 
constructor(public readonly authorizedRequest: APIRequestContext) {
  this.authorizedRequest = authorizedRequest
}
 
async createUser(role: string) {
  const context = await request.newContext()
  const createUser = await context.post(`${settings.baseURL}/users`, {
    data: {
      full_name: await createRandomString(2, 7),
      email: await createRandomString(2, 8),
      role: role,
      username: await createRandomString(2, 9),
      phone_number: await createRandomString(2, 10),
      password: "1234567"
    },
  })
  await expect(createUser, `The user isn't created`).toBeOK()

  const userData = await createUser.json() as User

  console.log(`The following user with ${userData.role} role is created`, userData)
  
  return userData
}

async getUser(userID: string) {
  const getUser = await this.authorizedRequest.get(`${settings.baseURL}/users/${userID}`)
  await expect(getUser, `Get user request is failed`).toBeOK()

  const userData = await getUser.json() as User

  return userData
}

async deleteUser(userID: string) {
  const deleteUser = await this.authorizedRequest.delete(`${settings.baseURL}/users/${userID}`)
  expect(deleteUser, `The user isn't deleted`).toBeOK()

  console.log(`The user with user_id ${userID} is deleted`)

  const getDeletedUser = (await this.authorizedRequest.get(`${settings.baseURL}/users/${userID}`)).status()
  expect(getDeletedUser, `The user still exists`).toBe(404)
}

}
