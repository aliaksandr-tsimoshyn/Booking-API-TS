import { settings } from "../utils/settings"
import { test } from "../utils/extensions"
import { createAuthorizedAPIContext } from "../utils/helpers/general"

test.beforeAll(async () => {
  settings.authorizedRequest = await createAuthorizedAPIContext(settings.myUser.username,
    settings.myUser.password as string)
})

test.describe(`FLIGHTS`, () => {

  test(`Get All Flights`, async ({ flights }) => {
    await flights.getAllFlights()
  })

  test(`Get My Bookings`, async ({ flights }) => {
    await flights.getUserBookings(settings.myUser.user_id as string)
  })

})

