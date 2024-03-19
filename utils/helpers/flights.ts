import { APIRequestContext, expect, request } from "@playwright/test"
import { settings } from "../settings"
import { Flight } from "../interfaces"

export class Flights {
 
constructor(public readonly authorizedRequest: APIRequestContext) {
  this.authorizedRequest = authorizedRequest
}
 
async getAllFlights() {
  const flights = await this.authorizedRequest.get(`${settings.baseURL}/flights`)
  await expect(flights, `Get all flights request is failed`).toBeOK()

  const flightsData = await flights.json() as Flight

  console.log(`Existing flights are`, flightsData.objects)

  return flightsData
}

async getUserBookings(userID: string) {
  const bookings = await this.authorizedRequest.get(`${settings.baseURL}/users/${userID}/bookings`)
  await expect(bookings, `Get bookings request is failed`).toBeOK()

  const bookingsData = await bookings.json() 

  console.log(`User bookings are`, bookingsData)

  return bookingsData
}

}
