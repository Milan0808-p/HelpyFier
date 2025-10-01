const {model} = require('mongoose');

const listingSchema = require('../schemas/listingSchema');

const Listing = model('Listing', listingSchema);

module.exports = Listing;