const http = require("http");
const fs = require("fs");
const { ClientVerify } = require("./DigitalSign");

let resource_options = {
  host: "localhost",
  path: "/resource",
  port: 3000,
  method: "GET",
};

let options = {
  host: "localhost",
  path: "/",
  port: 3000,
  method: "GET",
  headers: { "content-type": "application/json" },
};

const request = http.request(resource_options, (res) => {
  const file = fs.createWriteStream(__dirname + "\\files\\verified_data.txt");
  res.pipe(file);

  const req = http.request(options, (res) => {
    let data = "";
    res.on("data", (chunk) => {
      data += chunk.toString("utf-8");
    });

    res.on("end", () => {
      let signcontext = JSON.parse(data);
      const x = new ClientVerify(signcontext);
      const rs = fs.createReadStream(__dirname + "\\files\\verified_data.txt");
      x.verify(rs, (result) => {
        console.log("result:", result);
      });
    });
  });

  req.on("error", (e) => {
    console.log("http.request: error:", e.message);
  });
  req.end();
});

request.on("error", (e) => {
  console.log("http.request: error:", e.message);
});
request.end();
