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

test.describe(`USERS`, () => {

  test(`Get My User`, async ({ authorizedRequest }) => {
    const user = await authorizedRequest.get(`${settings.baseURL}/users/${settings.myUser.userID}`)
    await expect(user, `The user isn't got`).toBeOK()

    const userData = await user.json()
    expect(userData.full_name, `Full name isn't Alex`).toBe(`ALEX`)

    console.log(userData)
  })

  test(`Create User`, async ({ authorizedRequest }) => {
    const createUser = await authorizedRequest.post(`${settings.baseURL}/users`, {
      data: {
        full_name: await createRandomString(2, 7),
        email: await createRandomString(2, 8),
        role: "admin",
        username: await createRandomString(2, 9),
        phone_number: await createRandomString(2, 10),
        password: "1234567"
      },
    })
    await expect(createUser, `The user isn't created`).toBeOK()

    const userData = await createUser.json()
    settings.userID = userData.user_id

    console.log(userData)
  })

  test(`User Partial Update`, async ({ authorizedRequest }) => {
    expect(settings.userID, `UserID is empty`).not.toBe('')
    const userID = settings.userID

    const newFullName = await createRandomString(2, 7)
    console.log(newFullName)

    const updateUser = await authorizedRequest.patch(`${settings.baseURL}/users/${userID}`, {
      data: {
        full_name: newFullName
      },
    })
    await expect(updateUser, `The user isn't updated`).toBeOK()

    const newUserData = await updateUser.json()
    expect(newUserData.full_name, `Full name isn't updated`).toBe(newFullName.toUpperCase())

    console.log(newUserData)
  
  })

  test(`User Full Update`, async ({ authorizedRequest }) => {
    expect(settings.userID, `UserID is empty`).not.toBe('')
    const userID = settings.userID

    const newFullName = await createRandomString(2, 7)
    const newEmail = await createRandomString(2, 8)
    const newUsername = await createRandomString(2, 9)
    const newPhoneNumber = await createRandomString(2, 10)
    console.log(newFullName, newEmail, newUsername, newPhoneNumber)

    const updateUser = await authorizedRequest.put(`${settings.baseURL}/users/${userID}`, {
      data: {
        full_name: newFullName,
        email: newEmail,
        role: "admin",
        username: newUsername,
        phone_number: newPhoneNumber,
      },
    })
    await expect(updateUser, `The user isn't updated`).toBeOK()

    const newUserData = await updateUser.json()
    expect(newUserData.full_name, `Full name isn't updated`).toBe(newFullName.toUpperCase())
    expect(newUserData.email, `Email isn't updated`).toBe(newEmail)
    expect(newUserData.username, `Username isn't updated`).toBe(newUsername)
    expect(newUserData.phone_number, `Phone number isn't updated`).toBe(newPhoneNumber)

    console.log(newUserData)
  
  })

  test(`Delete User`, async ({ authorizedRequest }) => {
    expect(settings.userID, `UserID is empty`).not.toBe('')
    const userID = settings.userID

    const deleteUser = (await authorizedRequest.delete(`${settings.baseURL}/users/${userID}`)).status()
    expect(deleteUser, `The user isn't deleted`).toBe(204)

    console.log(`The user with user_id ${userID} is deleted with status code ${deleteUser}`)

    const getDeletedUser = (await authorizedRequest.get(`${settings.baseURL}/users/${userID}`)).status()
    expect(getDeletedUser, `The user still exists`).toBe(404)
  
  })

})

