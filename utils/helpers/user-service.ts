import { APIRequestContext, expect, request } from '@playwright/test'
import { settings, roles } from '../settings'
import { User } from '../interfaces'
import { Base } from './base'

export class UserService extends Base {
  async createUser(role: string, statusCode: number, authRole = roles.admin) {
    const createUser = await (await this.authorizedAPIContext(authRole)).post(`${settings.baseURL}/users`, {
      data: {
        full_name: await this.createRandomString(2, 7),
        email: await this.createRandomString(2, 8),
        role: role,
        username: await this.createRandomString(2, 9),
        phone_number: await this.createRandomString(2, 10),
        password: await this.createRandomString(2, 11),
      },
    })

    await expect(createUser.status(), `The user isn't created`).toBe(statusCode)

    const userData = (await createUser.json()) as User

    console.log(`The following user with ${userData.role} role is created`, userData)

    return userData
  }

  async getUser(userID: string, statusCode: number, authRole = roles.admin) {
    const getUser = await (await this.authorizedAPIContext(authRole)).get(`${settings.baseURL}/users/${userID}`)
    await expect(getUser.status(), `Get user request is failed`).toBe(statusCode)

    const userData = (await getUser.json()) as User

    return userData
  }

  async patchUser(userID: string, newData: {}, statusCode: number, authRole = roles.admin) {
    const patchUser = await (await this.authorizedAPIContext(authRole)).patch(`${settings.baseURL}/users/${userID}`, {
      data: newData,
    })
    await expect(patchUser.status(), `The user isn't updated`).toBe(statusCode)

    const newUserData = (await patchUser.json()) as User

    return newUserData
  }

  async putUser(userID: string, newData: {}, statusCode: number, authRole = roles.admin) {
    const putUser = await (await this.authorizedAPIContext(authRole)).put(`${settings.baseURL}/users/${userID}`, {
      data: newData,
    })
    await expect(putUser.status(), `The user isn't updated`).toBe(statusCode)

    const newUserData = (await putUser.json()) as User

    return newUserData
  }

  async deleteUser(userID: string, statusCode: number, authRole = roles.admin) {
    const deleteUser = await (await this.authorizedAPIContext(authRole)).delete(`${settings.baseURL}/users/${userID}`)
    expect(deleteUser.status(), `The user isn't deleted`).toBe(statusCode)
  }
}
