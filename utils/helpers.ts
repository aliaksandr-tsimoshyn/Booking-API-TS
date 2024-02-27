import { APIRequestContext, expect, request } from "@playwright/test"
import { settings } from "./settings"


export async function createAuthorizedAPIContext(username: string, password: string) {
  const context = await request.newContext()
    const loginResponse = await context.post(`${settings.baseURL}/token`, {
      form: {
        username: username,
        password: password
      },
    })
    await expect(loginResponse, `The user isn't logged in`).toBeOK()
  
    const token = (await loginResponse.json()).access_token
  
    const authorizedContext = await request.newContext({
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`, 
      },
    })

  return authorizedContext
}

export async function getUser(userID: string, authorizedRequest: APIRequestContext) {
  const user = await authorizedRequest.get(`${settings.baseURL}/users/${userID}`)

  await expect(user, `The user doesn't exist`).toBeOK()

  const userData = await user.json()

  return userData
}

