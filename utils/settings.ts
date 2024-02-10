import { APIRequestContext, BrowserContext } from "@playwright/test"

type Settings = {
  baseURL: string,
  sessionID: string,
  authorizedContext: BrowserContext | null,
  authorizedRequest: APIRequestContext | null
  activeUser: User,

}

type User = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
}

export const settings: Settings = {
  baseURL: process.env.URL || '',
  sessionID: '',
  authorizedContext: null,
  authorizedRequest: null,
  activeUser: {
    firstName: 'Aliaksandr',
    lastName: 'Tsimoshyn',
    email: process.env.EMAIL || '',
    password: process.env.PASSWORD || '',
  },
}



