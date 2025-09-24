const {model}=require('mongoose');

const providerSchema = require('../schemas/ProviderSchema');

const Provider = model('Provider', providerSchema);
module.exports = Provider;


