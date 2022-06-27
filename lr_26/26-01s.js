const { ServerDH } = require("./DH");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cipherFile = require("./fileCrypto").cipherFile;

let serverDH;
let serverSecret;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  serverDH = new ServerDH(1024, 3);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(serverDH.getContext()));
});

app.post("/setKey", (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const clientContext = JSON.parse(body);
    if (clientContext.key_hex !== undefined) {
      serverSecret = serverDH.getSecret(clientContext);

      console.log("serverSecret:", serverSecret);

      res.writeHead(200, { "Content-Type": "text/plain" });
      const key = new Buffer(32);
      serverSecret.copy(key, 0, 0, 32);

      const rs = fs.createReadStream(__dirname + "\\files\\origin_data.txt");
      const ws = fs.createWriteStream(__dirname + "\\files\\crypted_data.txt");
      cipherFile(rs, ws, key);
      res.end("Success");
    } else {
      res.statusCode = 409;
      res.end("Sth wrong.");
    }
  });
});

app.get("/resource", (req, res) => {
  if (serverSecret !== undefined) {
    res.statusCode = 200;
    let rs2 = fs.createReadStream(__dirname + "\\files\\crypted_data.txt");
    rs2.pipe(res);
    rs2.on("close", () => {
      console.log(rs2.bytesRead);
      res.end();
    });
  } else {
    res.statusCode = 409;
    res.end("Set key");
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Started on 3000 port.");
});
