const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Пароль буде хешуватись перед збереженням
});

module.exports = mongoose.model("User", UserSchema);
