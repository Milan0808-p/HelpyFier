const {model} = require('mongoose');

const bookingSchema = require('../schemas/BookingSchema');

const Booking = model('Booking', bookingSchema);

module.exports = Booking;


