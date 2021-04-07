const express = require("express");

const server = express();

// remember express by default cannot parse JSON in request bodies
const logger = (req, res, next) => {
  console.log(req);
  console.log(`[${req.method}]`);
  next();
};
// global middlewares and the user's router need to be connected here

server.use(logger);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

module.exports = server;
