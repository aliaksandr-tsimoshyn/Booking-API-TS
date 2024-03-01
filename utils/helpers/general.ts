import { expect, request } from "@playwright/test"
import { settings } from "../settings"


export async function createAuthorizedAPIContext(username: string, password: string) {
  const context = await request.newContext()
    const login = await context.post(`${settings.baseURL}/token`, {
      form: {
        username: username,
        password: password
      },
    })
    await expect(login, `The user isn't logged in`).toBeOK()
  
    const token = (await login.json()).access_token
  
    const authorizedContext = await request.newContext({
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`, 
      },
    })

  return authorizedContext
}

export async function createRandomString(start: number, end: number) {
  const randomString = Math.random().toString(36).substring(start, end)

  return randomString
}


