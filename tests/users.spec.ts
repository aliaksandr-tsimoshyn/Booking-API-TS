import { expect, request} from "@playwright/test"
import { settings } from "../utils/settings"
import { test } from "../utils/extensions"
import { createAuthorizedAPIContext, createRandomString} from "../utils/helpers/general"
import { User } from "../utils/interfaces"

test.beforeAll(async () => {
  settings.authorizedRequest = await createAuthorizedAPIContext(
    settings.myUser.username,
    settings.myUser.password as string
  )
})

test.describe.only(`USERS`, () => {

  test(`Get My User`, async ({ users }) => {
    const userData = await users.getUser(settings.myUser.user_id as string)
    expect(userData.full_name, `Full name isn't ${settings.myUser.full_name}`).toBe(settings.myUser.full_name)

    console.log(`My user is`, userData)
  })

  test(`Create User`, async ({ users }) => {
    const userData = await users.createUser(`admin`)

    console.log(`The following user with ${userData.role} role is created`, userData)

    await users.deleteUser(userData.user_id as string)
  })

  test(`User Partial Update`, async ({ authorizedRequest, users }) => {
    const userData = await users.createUser(`admin`)

    const newFullName = await createRandomString(2, 7)
    console.log(`New generated data is`, newFullName)

    const updateUser = await authorizedRequest.patch(`${settings.baseURL}/users/${userData.user_id}`, {
      data: {
        full_name: newFullName
      },
    })
    await expect(updateUser, `The user isn't updated`).toBeOK()

    const newUserData = await updateUser.json() as User
    expect(newUserData.full_name, `Full name isn't updated`).toBe(newFullName.toUpperCase())

    console.log(`Updated user data is`, newUserData)

    await users.deleteUser(userData.user_id as string)
  })

  test(`User Full Update`, async ({ authorizedRequest, users }) => {
    const userData = await users.createUser(`admin`)

    const newFullName = await createRandomString(2, 7)
    const newEmail = await createRandomString(2, 8)
    const newUsername = await createRandomString(2, 9)
    const newPhoneNumber = await createRandomString(2, 10)
    console.log(`New generated data is`, newFullName, newEmail, newUsername, newPhoneNumber)

    const updateUser = await authorizedRequest.put(`${settings.baseURL}/users/${userData.user_id}`, {
      data: {
        full_name: newFullName,
        email: newEmail,
        role: "admin",
        username: newUsername,
        phone_number: newPhoneNumber,
      },
    })
    await expect(updateUser, `The user isn't updated`).toBeOK()

    const newUserData = await updateUser.json() as User
    expect(newUserData.full_name, `Full name isn't updated`).toBe(newFullName.toUpperCase())
    expect(newUserData.email, `Email isn't updated`).toBe(newEmail)
    expect(newUserData.username, `Username isn't updated`).toBe(newUsername)
    expect(newUserData.phone_number, `Phone number isn't updated`).toBe(newPhoneNumber)

    console.log(`Updated user data is`, newUserData)

    await users.deleteUser(userData.user_id as string as string)
  })

  test(`Delete User`, async ({ users }) => {
    const userData = await users.createUser(`admin`)

    await users.deleteUser(userData.user_id as string) 
  })

})

