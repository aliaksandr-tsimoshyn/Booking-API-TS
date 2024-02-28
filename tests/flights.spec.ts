import { expect, request} from "@playwright/test"
import { settings } from "../utils/settings"
import { test } from "../utils/extensions"
import { createAuthorizedAPIContext, createRandomString } from "../utils/helpers"

test.beforeAll(async () => {
  settings.authorizedRequest = await createAuthorizedAPIContext(
    settings.myUser.username,
    settings.myUser.password
  )
})

test.describe(`FLIGHTS`, () => {

  test(`Get All Flights`, async ({ authorizedRequest }) => {
    const flights = await authorizedRequest.get(`${settings.baseURL}/flights`)
    await expect(flights, `Flights don't exist`).toBeOK()

    const flightsData = await flights.json()

    console.log(flightsData)
  })

  test(`Get My Bookings`, async ({ authorizedRequest }) => {
    const bookings = await authorizedRequest.get(`${settings.baseURL}/users/${settings.myUser.userID}/bookings`)
    await expect(bookings, `Bookings aren't got`).toBeOK()

    const bookingsData = await bookings.json()

    console.log(bookingsData)
  })

})

