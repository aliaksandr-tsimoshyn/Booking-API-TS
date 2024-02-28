import { APIRequestContext } from "@playwright/test"

type Settings = {
  baseURL: string,
  authorizedRequest: APIRequestContext | null,
  userID: string,
  myUser: User
}

type User = {
  username: string,
  password: string,
  userID: string
}

export const settings: Settings = {
  baseURL: process.env.URL || '',
  authorizedRequest: null,
  userID: '',
  myUser: {
    username: process.env.MYUSERNAME || '',
    password: process.env.MYPASSWORD || '',
    userID: '347'
  }
}

// {
//   "full_name": "ALEX",
//   "email": "alex@gmail.com",
//   "role": "admin",
//   "username": "alex",
//   "password": 7777777,
//   "phone_number": "1111111",
//   "user_id": 347
// }



