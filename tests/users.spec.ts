import { expect, request} from "@playwright/test"
import { settings } from "../utils/settings"
import { test } from "../utils/extensions"
import { createAuthorizedAPIContext, getUser } from "../utils/helpers"

test.beforeAll(async () => {
  settings.authorizedRequest = await createAuthorizedAPIContext(
    settings.myUser.username,
    settings.myUser.password
  )
})

test.describe(`USERS`, () => {
  test(`Get My User`, async ({ authorizedRequest }) => {
    const userData = await getUser(settings.myUser.userID, authorizedRequest)

    expect(userData.full_name, `Full name isn't Alex`).toBe(`ALEX`)

    console.log(userData)
  })

  test.only(`Create User`, async ({ authorizedRequest }) => {

    const createUser = await authorizedRequest.post(`${settings.baseURL}/users`, {
      data: {
        full_name: "TEST USER",
        email: "testuser@gmail.com",
        role: "admin",
        username: "test user",
        phone_number: "2222222",
        password: "1234567"
      },
    })
    await expect(createUser, `The user isn't created`).toBeOK()

    const userData = await createUser.json()
    settings.testUser.userID = userData.user_id

    console.log(userData)
  
  })

  test.only(`Delete User`, async ({ authorizedRequest }) => {
    expect(settings.testUser.userID, `UserID is empty`).not.toBe('')

    const deleteUser = (await authorizedRequest.delete(`${settings.baseURL}/users/${settings.testUser.userID}`)).status()
    expect(deleteUser, `The user isn't deleted`).toBe(204)

    console.log(`The user is deleted with status code ${deleteUser}`)

    const getDeletedUser = (await authorizedRequest.get(`${settings.baseURL}/users/${settings.testUser.userID}`)).status()

    expect(getDeletedUser, `The user still exists`).toBe(404)
  
  })
})

