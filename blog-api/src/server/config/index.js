const express = require("express");
const mongoose = require("mongoose");
const db = require("./keys").mongoURI;
const createServer = require("./createServer");

mongoose
  .connect(db, {
    dbName: "blogdb",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const app = createServer();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`app running on port: ${port} `);
    });
  })
  .catch((err) => {
    console.log("could not connect to mongodb and start the server");
    console.log(err);
  });
