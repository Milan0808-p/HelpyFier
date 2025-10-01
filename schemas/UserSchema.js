const {Schema} = require("mongoose");

const userSchema = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  address: {type: String, required: true},
  password: {type: String, required: true},
  role: { type: String, default: 'user', enum: ['user', 'provider'] }
});

module.exports = userSchema;