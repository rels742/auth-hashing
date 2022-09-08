const express = require("express");
const app = express();

const morgan = require("morgan");
const cors = require("cors");

app.disable("x-powered-by");

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const registrationsRouter = require("./routers/registrations.js");
const sessionsRouter = require("./routers/sessions.js");
const userRouter = require("./routers/user");

app.use("/register", registrationsRouter);
app.use("/login", sessionsRouter);
app.use("/user", userRouter);

module.exports = app;
