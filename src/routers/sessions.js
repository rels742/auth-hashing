const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma.js");

router.post("/", async (req, res) => {
  // Get the username and password from the request body
  const { username, password } = req.body;

  // Check that a user with that username exists in the database
  //prisma function would be findUnique
  // const foundUser the uses the correct prisma, findUnique to find the user by their username
  // make an if statement for if user is not found, error message

  const foundUser = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!foundUser) {
    return res.status(401).json({ msg: "Invalid username or password" });
  }

  // Use bcrypt to check that the provided password matches the hashed password on the user
  const comparePassword = await bcrypt.compare(password, foundUser.password);

  // If either of these checks fail, respond with a 401 "Invalid username or password" error
  if (!comparePassword) {
    return res.status(401).json({ msg: "Invalid username or password" });
  }

  // If the user exists and the passwords match, create a JWT containing the username in the payload
  // Use the JWT_SECRET environment variable for the secret key

  const token = jwt.sign({ username }, process.env.JWT_SECRET);

  // Send a JSON object with a "token" key back to the client, the value is the JWT created
  res.json({ token });
});

module.exports = router;
