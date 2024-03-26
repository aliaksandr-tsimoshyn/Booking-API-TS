import { APIRequestContext, expect, request } from '@playwright/test'
import { roles, settings } from '../settings'
import { Flights } from '../interfaces'
import { Base } from './base'

export class FlightService extends Base {
  async getAllFlights(statusCode: number, authRole = roles.admin) {
    const flights = await (await this.authorizedAPIContext(authRole)).get(`${settings.baseURL}/flights`)
    await expect(flights.status(), `Get all flights request is failed`).toBe(statusCode)

    const flightsData = (await flights.json()) as Flights

    console.log(`Existing flights are`, flightsData.objects)

    return flightsData
  }

  async getUserBookings(userID: string, statusCode: number, authRole = roles.admin) {
    const bookings = await (await this.authorizedAPIContext(authRole)).get(
      `${settings.baseURL}/users/${userID}/bookings`
    )
    await expect(bookings.status(), `Get bookings request is failed`).toBe(statusCode)

    const bookingsData = await bookings.json()

    return bookingsData
  }
}
