import { expect } from '@playwright/test'
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

test.describe(`USERS`, () => {
  // Test data for Get User test
  const testData1 = [
    { statusCode: 200, authRole: roles.admin },
    { statusCode: 403, authRole: roles.customer },
  ]

  for (const data of testData1) {
    test(`Get User By ${data.authRole}`, async ({ userService, newCustomer }) => {
      const userData = await userService.getUser(
        newCustomer.user_id as string,
        data.statusCode,
        data.authRole
      )

      if (data.authRole === roles.admin) {
        expect(userData.full_name, `Full name isn't ${newCustomer.full_name}`).toBe(newCustomer.full_name)
        console.log(`The following user is got`, userData)
      } else if (data.authRole === roles.customer) {
        console.log(`Get user request is forbidden for ${data.authRole}`)
      }
    })
  }

  // Test data for Create User test
  const testData2 = [
    { statusCode: 201, authRole: roles.admin },
    { statusCode: 201, authRole: roles.customer },
  ]

  for (const data of testData2) {
    test(`Create User By ${data.authRole}`, async ({ userService }) => {
      const userData = await userService.createUser(roles.customer, data.statusCode, data.authRole)

      await userService.deleteUser(userData.user_id as string, 204)
    })
  }

  // Test data for Patch and Put User tests
  const testData3 = [
    { statusCode: 200, authRole: roles.admin },
    { statusCode: 403, authRole: roles.customer },
  ]

  for (const data of testData3) {
    test(`User Partial Update By ${data.authRole}`, async ({ userService, newCustomer }) => {
      const newData = {
        full_name: await userService.createRandomString(2, 7),
      }
      console.log(`New full name is`, newData.full_name)

      const newUserData = await userService.patchUser(
        newCustomer.user_id as string,
        newData,
        data.statusCode,
        data.authRole
      )

      if (data.authRole === roles.admin) {
        expect(newUserData.full_name, `Full name isn't updated`).toBe(newData.full_name.toUpperCase())
        console.log(`New user data is`, newUserData)
      } else if (data.authRole === roles.customer) {
        console.log(`Patch user request is forbidden for ${data.authRole}`)
      }
    })
  }

  for (const data of testData3) {
    test(`User Full Update by ${data.authRole}`, async ({ userService, newCustomer }) => {
      const newData = {
        full_name: await userService.createRandomString(2, 7),
        email: await userService.createRandomString(2, 8),
        role: roles.customer,
        username: await userService.createRandomString(2, 9),
        phone_number: await userService.createRandomString(2, 10),
      }
      console.log(`New generated data is`, newData)

      const newUserData = await userService.putUser(
        newCustomer.user_id as string,
        newData,
        data.statusCode,
        data.authRole
      )

      if (data.authRole === roles.admin) {
        expect(newUserData.full_name, `Full name isn't updated`).toBe(newData.full_name.toUpperCase())
        expect(newUserData.email, `Email isn't updated`).toBe(newData.email)
        expect(newUserData.username, `Username isn't updated`).toBe(newData.username)
        expect(newUserData.phone_number, `Phone number isn't updated`).toBe(newData.phone_number)
        console.log(`New user data is`, newUserData)
      } else if (data.authRole === roles.customer) {
        console.log(`Put user request is forbidden for ${data.authRole}`)
      }
    })
  }

  test(`Delete User By Admin`, async ({ userService }) => {
    const userData = await userService.createUser(roles.customer, 201)

    await userService.deleteUser(userData.user_id as string, 204)
    console.log(`The user with user_id ${userData.user_id} is deleted`)

    await userService.getUser(userData.user_id as string, 404)
    console.log(`The user with user_id ${userData.user_id} doesn't exist`)
  })

  test(`Delete User By Customer`, async ({ userService, newCustomer }) => {
    await userService.deleteUser(newCustomer.user_id as string, 403, roles.customer)
    console.log(`Delete user request is forbidden for ${roles.customer}`)
  })
})
