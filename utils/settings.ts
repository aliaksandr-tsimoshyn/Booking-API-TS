import { APIRequestContext } from '@playwright/test'
import { User } from '../utils/interfaces'

type Settings = {
  baseURL: string
  authorizedRequest: APIRequestContext | null
  myUser: User
}

export const settings: Settings = {
  baseURL: process.env.URL || '',
  authorizedRequest: null,
  myUser: {
    full_name: 'ALEX',
    email: 'alex@gmail.com',
    role: 'admin',
    username: process.env.MYUSERNAME || '',
    password: process.env.MYPASSWORD || '',
    phone_number: '1111111',
    user_id: '347',
  },
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
