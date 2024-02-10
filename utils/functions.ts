import { expect, request } from "@playwright/test"
import { settings } from "./settings"
import { Browser } from "@playwright/test"

export async function getSessionID(email: string, password: string) {
  const context = await request.newContext()
  const loginResponse = await context.post(`${settings.baseURL}api/auth`, {
    data: {
      username: email,
      password: password,
    },
  })
  await expect(
    loginResponse,
    `Login request is failed. Impossible to get sessionID`
  ).toBeOK()

  const loginResponseCookies = loginResponse.headers()[`set-cookie`]
  const sessionIDIndex = loginResponseCookies.indexOf(`sessionid=`)
  settings.sessionID = loginResponseCookies.slice(
    sessionIDIndex + 10,
    sessionIDIndex + 42
  )
}

export async function createAuthorizedAPIContext(email: string, password: string) {
  await getSessionID(email, password)

  const authorizedRequest = await request.newContext({
    extraHTTPHeaders: {
      Cookie: `sessionid=${settings.sessionID}`,
    },
  })

  return authorizedRequest
}

export async function createAuthorizedWebContext(email: string, password: string, browser: Browser) {
  await getSessionID(email, password)

  const authorizedContext = await browser.newContext()

  await authorizedContext.addCookies([
    { name: "sessionid", value: settings.sessionID, url: settings.baseURL },
  ])

  return authorizedContext
}
