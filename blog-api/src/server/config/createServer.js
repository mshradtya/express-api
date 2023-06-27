const express = require("express");
var cors = require("cors");
const users = require("../routes/usersRoute");

function createServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(function (err, req, res, next) {
    if (err instanceof SyntaxError && err.status === 404 && "body" in err) {
      res
        .status(400)
        .json(
          "the sever did not recieve a valid JSON, please try again checking for syntax errors"
        );
    }
  });
  app.use("/api", users);
  return app;
}

module.exports = createServer;
