import { expect} from "@playwright/test"
import { settings } from "../utils/settings"
import { test } from "../utils/extensions"
import { createAuthorizedAPIContext, createRandomString} from "../utils/helpers/general"

test.beforeAll(async () => {
  settings.authorizedRequest = await createAuthorizedAPIContext(
    settings.myUser.username,
    settings.myUser.password as string
  )
})

test.describe(`USERS`, () => {

  test(`Get User`, async ({ users, newUser }) => {
    const userData = await users.getUser(newUser.user_id as string)
    expect(userData.full_name, `Full name isn't ${newUser.full_name}`).toBe(newUser.full_name)

    console.log(`The following user is got`, userData)
  })

  test(`Create User`, async ({ users }) => {
    const userData = await users.createUser(`admin`)

    await users.deleteUser(userData.user_id as string)
  })

  test(`User Partial Update`, async ({ users, newUser }) => {  
    const newData = { 
      full_name: await createRandomString(2, 7)
    }
    console.log(`New full name is`, newData.full_name)

    const newUserData = await users.patchUser(newUser.user_id as string, newData)

    expect(newUserData.full_name, `Full name isn't updated`).toBe(newData.full_name.toUpperCase())

    console.log(`New user data is`, newUserData)
  })

  test(`User Full Update`, async ({ users, newUser }) => {
    const newData = {
      full_name: await createRandomString(2, 7),
      email: await createRandomString(2, 8),
      role: `admin`,
      username: await createRandomString(2, 9),
      phone_number: await createRandomString(2, 10)
    }
    console.log(`New generated data is`, newData)

    const newUserData = await users.putUser(newUser.user_id as string, newData)

    expect(newUserData.full_name, `Full name isn't updated`).toBe((newData.full_name).toUpperCase())
    expect(newUserData.email, `Email isn't updated`).toBe(newData.email)
    expect(newUserData.username, `Username isn't updated`).toBe(newData.username)
    expect(newUserData.phone_number, `Phone number isn't updated`).toBe(newData.phone_number)

    console.log(`New user data is`, newUserData)
  })

  test(`Delete User`, async ({ users }) => {
    const userData = await users.createUser(`admin`)

    await users.deleteUser(userData.user_id as string) 
  })

})

