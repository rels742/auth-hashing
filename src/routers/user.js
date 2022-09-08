const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma.js");

router.delete("/:id", async (req, res) => {
  const [_, token] = req.get("Authorization").split(" ");
  // console.log(_);
  // console.log(token);

  // use jwt verify to verify the token and decoding it to get the username
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);

    // get the user from the database with the decode
    const user = await prisma.user.findUnique({
      where: {
        username: decoded.username,
      },
    });
    // console.log(user);

    // an if statement to check the role of the user is an admin, if so then delete that user requested in the url otherwise do not permit it
    if (user.role === "ADMIN") {
      await prisma.user.delete({
        where: {
          id: Number(req.params.id),
        },
      });

      return res.status(201).json({ msg: "ok" });
    }
    res.status(201).json({ msg: "Not allowed,user is not an admin" });
  } catch (e) {
    res.status(400).json({ msg: "something went wrong" });
  }
});

module.exports = router;
