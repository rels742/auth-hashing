const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma.js");

router.post("/", async (req, res) => {
  // Get the username and password from request body
  const data = {
    username: req.body.username,
    password: req.body.password,
  };

  // Hash the password: https://github.com/kelektiv/node.bcrypt.js#with-promises
  // created a hashed version of the password, save it in a variable

  const hashed = await bcrypt.hash(data.password, 10);
  console.log(hashed);

  // Save the user using the prisma user model, setting their password to the hashed version
  //use prisma seeding method to create a user and set their password to the hashed version - how it get stored in stored in database
  const createUser = await prisma.user.create({
    data: {
      username: data.username,
      password: hashed,
    },
  });

  // Respond back to the client with the created users username and id
  res.status(201).json({ username: createUser.username, id: createUser.id });

  // do not send passwords back to client
});

module.exports = router;
