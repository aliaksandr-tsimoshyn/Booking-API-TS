import { expect } from "@playwright/test"
import { settings } from "../utils/settings"
import { test } from "../utils/extensions"
import { createAuthorizedAPIContext } from "../utils/helpers"

/*test.beforeAll(async () => {
  settings.authorizedRequest = await createAuthorizedAPIContext(
    settings.activeUser.email,
    settings.activeUser.password
  )
})*/

test.describe(`API Tests`, () => {
  test(`@api Login To Espresa`, async ({ request }) => {
    const loginResponse = await request.post(`${settings.baseURL}api/auth`, {
      data: {
        username: settings.activeUser.email,
        password: settings.activeUser.password,
      },
    })
    await expect(loginResponse, `The user isn't logged in`).toBeOK()

    let loginStatus = loginResponse.status()

    console.log(`The user is logged in with status code ${loginStatus}`)
  })

  test(`@api Negative Login To Espresa`, async ({ request, invalidUser }) => {
    const loginResponse = await request.post(`${settings.baseURL}api/auth`, {
      data: {
        username: invalidUser.email,
        password: invalidUser.password,
      },
    })

    let loginStatus = loginResponse.status()
    expect(loginStatus, `Login status isn't 401`).toBe(401)

    let errorText = (await loginResponse.json()).detail

    console.log(errorText)
  })

  test(`@api Get User Coins`, async ({ authorizedRequest }) => {
    const apiResponse = await authorizedRequest.get(
      `${settings.baseURL}api/company/employee/points/`
    )
    await expect(apiResponse, `Request is failed`).toBeOK()

    let userCoins = (await apiResponse.json()).available_points

    console.log(`${userCoins} LX Coins are available to the user`)
  })
})

test.only(`Get Token`, async ({ request }) => {
  const loginResponse = await request.post(`https://bookings-api-667x.onrender.com/token`, {
    form: {
      username: `alex`,
      password: `7777777`
    },
  })
  await expect(loginResponse, `The user isn't logged in`).toBeOK()

  const loginStatus = loginResponse.status()

  const token = (await loginResponse.json()).access_token

  console.log(`The user is logged in with status code ${loginStatus}`)
  console.log(token)
})
