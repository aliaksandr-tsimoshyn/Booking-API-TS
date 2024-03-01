import { expect} from "@playwright/test"
import { settings } from "../utils/settings"
import { Flights } from "../utils/interfaces"
import { test } from "../utils/extensions"
import { createAuthorizedAPIContext } from "../utils/helpers/general"

test.beforeAll(async () => {
  settings.authorizedRequest = await createAuthorizedAPIContext(settings.myUser.username,
    settings.myUser.password as string)
})

test.describe(`FLIGHTS`, () => {

  test(`Get All Flights`, async ({ authorizedRequest }) => {
    const flights = await authorizedRequest.get(`${settings.baseURL}/flights`)
    await expect(flights, `Get flights request is failed`).toBeOK()

    const flightsData = await flights.json() as Flights

    console.log(`Existing flights are`, flightsData.objects)
  })

  test(`Get My Bookings`, async ({ authorizedRequest }) => {
    const bookings = await authorizedRequest.get(`${settings.baseURL}/users/${settings.myUser.user_id}/bookings`)
    await expect(bookings, `Get bookings request is failed`).toBeOK()

    const bookingsData = await bookings.json()

    console.log(`Existing bookings are`, bookingsData)
  })

})

