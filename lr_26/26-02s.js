const { ServerSign } = require("./DigitalSign");
const fs = require("fs");
//let rs2 = fs.createReadStream("./files/origin_data.txt");
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  const ss = new ServerSign();
  //const rs = fs.createReadStream(__dirname + "\\files\\origin_data.txt");
  const rs = fs.createReadStream(__dirname + "\\files\\wrong_data.txt");

  ss.getSignContext(rs, (signcontext) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(signcontext));
  });
});

app.get("/resource", (req, res) => {
  const rs2 = fs.createReadStream(__dirname + "\\files\\origin_data.txt");
  res.statusCode = 200;
  rs2.pipe(res);
  rs2.on("close", () => {
    console.log(rs2.bytesRead);
    res.end();
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Started on 3000 port.");
});
