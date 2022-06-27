const express = require("express");
const app = express();
const https = require("https");
const fs = require("fs");

let options = {
  key: fs.readFileSync(__dirname + "\\security\\key.key"),
  cert: fs.readFileSync(__dirname + "\\files\\LAB25-KEV.crt"),
};

app.get("/", (req, res) => {
  res.send("lr_25 HTTPS");
});

var server = https
  .createServer(
    {
      key: options.key,
      cert: options.cert,
      ciphers: [
        "ECDHE-RSA-AES128-SHA256",
        "DHE-RSA-AES128-SHA256",
        "AES128-GCM-SHA256",
        "RC4",
        "HIGH",
        "!MD5",
        "!aNULL",
      ].join(":"),
    },
    app
  )
  .listen(3000, () => {
    console.log("Started on 3000 port.");
  });
