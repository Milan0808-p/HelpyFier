const { Schema } = require("mongoose");
const listingSchema = require("./listingSchema"); // Import the listing schema
const bookingSchema = require("./BookingSchema"); // Import the booking schema

const providerSchema = new Schema({
  // Basic User Information
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // For the HASHED password

  // Provider-specific details
  isVerified: { type: Boolean, default: false }, // Renamed for clarity
  address: { type: String, required: true },

  // Services (using the listingSchema as a subdocument)
  // servicesOffered: [listingSchema],

  // Availability (as a nested object for easier scheduling)
  availability: {
    monday: [{ start: String, end: String }],
    tuesday: [{ start: String, end: String }],
    wednesday: [{ start: String, end: String }],
    thursday: [{ start: String, end: String }],
    friday: [{ start: String, end: String }],
    saturday: [{ start: String, end: String }],
    sunday: [{ start: String, end: String }],
  },

  // Role (Correctly defined for authorization)
  role: { type: String, default: "provider", enum: ["user", "provider"] },

  // Bookings (using the bookingSchema as a subdocument)
  bookings: [{
  type: Schema.Types.ObjectId,
  ref: 'Booking'
}],
  
  // Additional fields for a full dashboard
  totalRevenue: { type: Number, default: 0 },
  joinedDate: { type: Date, default: Date.now },
});

module.exports = providerSchema;
