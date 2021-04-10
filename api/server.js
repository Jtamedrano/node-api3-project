const express = require("express");
const userRouter = require("./users/users-router").router;

const server = express();

// remember express by default cannot parse JSON in request bodies
const logger = (req, res, next) => {
  console.log(`[${req.method}] ${req.url} - ${Date()}`);
  next();
};

// global middlewares and the user's router need to be connected here

server.use(express.json());
server.use(logger);

server.use("/api/users", userRouter);

module.exports = server;
