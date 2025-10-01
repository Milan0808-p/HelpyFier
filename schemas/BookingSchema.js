const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: "Provider", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: String,
  userEmail: String,
  serviceDate: String,
  serviceTime: String,
  address: String,
  notes: String,
  status: { type: String, default: "pending", enum: ["pending", "confirmed", "completed", "cancelled"] }
}, { timestamps: true });

module.exports = bookingSchema;



