const User = require("../models/User");

const createUser = async (
  firstName,
  lastName,
  email,
  password,
  jobTitle,
  bio,
  avatar
) => {
  const date = new Date();
  const formattedDate = date.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  const newUser = new User({
    account: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      role: "Subscriber",
      dateRegistered: formattedDate,
    },
    profile: {
      jobTitle: jobTitle,
      bio: bio,
      avatar: avatar,
    },
  });

  await newUser.save();

  return {
    _id: newUser._id,
    account: {
      firstName: newUser.account.firstName,
      lastName: newUser.account.lastName,
      email: newUser.account.email,
      role: newUser.account.role,
      dateRegistered: newUser.account.dateRegistered,
    },
    profile: {
      jobTitle: newUser.profile.jobTitle,
      bio: newUser.profile.bio,
      avatar: newUser.profile.avatar,
    },
  };
};

module.exports = {
  createUser,
};
