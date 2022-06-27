let app = require("express")();
let https = require("https");
let fs = require("fs");

let options = {
  key: fs.readFileSync("key.key").toString(),
  crt: fs.readFileSync("LAB25-KEV.crt").toString(),
};

var server = https
  .createServer(
    {
      key: options.key,
      cert: options.crt,
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
  .listen(3000);

app.get("/", (req, res) => {
  res.send("hallo from https, parni....");
});
