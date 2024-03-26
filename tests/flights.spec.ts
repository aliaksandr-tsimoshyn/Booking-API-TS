import { settings, testUsers, roles } from '../utils/settings'
import { test } from '../utils/fixtures'

test.beforeAll(async ({ userService }) => {
  settings.adminAPIContext = await userService.createAuthorizedAPIContext(
    testUsers.admin.username,
    testUsers.admin.password as string
  )

  settings.customerAPIContext = await userService.createAuthorizedAPIContext(
    testUsers.customer.username,
    testUsers.customer.password as string
  )
})

test.describe(`FLIGHTS`, () => {
  // Test data for Get All Flights test
  const testData1 = [
    { statusCode: 200, authRole: roles.admin },
    { statusCode: 200, authRole: roles.customer },
  ]

  for (const data of testData1) {
    test(`Get All Flights By ${data.authRole}`, async ({ flightService }) => {
      await flightService.getAllFlights(data.statusCode, data.authRole)
    })
  }

  // Test data for Get My Bookings test
  const testData2 = [
    { statusCode: 200, authRole: roles.admin },
    { statusCode: 403, authRole: roles.customer },
  ]

  for (const data of testData2) {
    test(`Get My Bookings By ${data.authRole}`, async ({ flightService }) => {
      const bookingsData = await flightService.getUserBookings(
        testUsers.admin.user_id as string,
        data.statusCode,
        data.authRole
      )

      if (data.authRole === roles.admin) {
        console.log(`User bookings are`, bookingsData)
      } else if (data.authRole === roles.customer) {
        console.log(`Get admin bookings request is forbidden for ${data.authRole}`)
      }
    })
  }
})
