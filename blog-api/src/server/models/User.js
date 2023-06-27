const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AccountSchema = require("../schemas/Account");
const ProfileSchema = require("../schemas/Profile");
const bcrypt = require("bcrypt");

const UserSchema = new Schema(
  {
    account: AccountSchema,
    profile: ProfileSchema,
  },
  { versionKey: false }
);

UserSchema.pre("save", async function (next) {
  const user = this;

  const structFirstName =
    user.account.firstName[0].toUpperCase() + user.account.firstName.slice(1);

  const structLastName =
    user.account.lastName[0].toUpperCase() + user.account.lastName.slice(1);

  user.account.firstName = structFirstName;
  user.account.lastName = structLastName;

  if (user.account.password.length < 33) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.account.password, salt);
    user.account.password = hashedPassword;
  }
  next();
});

UserSchema.post("save", function (error, doc, next) {
  const user = this;

  if (error.code === 11000) {
    next(
      new Error(`An account with email '${user.account.email}' already exists`)
    );
  }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
