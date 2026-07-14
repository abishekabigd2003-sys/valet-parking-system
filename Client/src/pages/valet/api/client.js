import api from '../../../services/api.js'

/**
 * Create a new parking booking.
 * POST /api/bookings
 */
export async function createBooking(form) {
  const { data } = await api.post('/bookings', form)
  return data
}
