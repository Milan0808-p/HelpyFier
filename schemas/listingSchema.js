const { Schema, Types } = require("mongoose");

const listingSchema = new Schema({
    name: { type: String, required: true },
    icon: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    providerId: { type: Types.ObjectId, required: true, ref: 'Provider' }
});

module.exports = listingSchema;
