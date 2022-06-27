const http = require("http");
const { ClientDH } = require("./DH");
const fs = require("fs");
const decipherFile = require("./fileCrypto").decipherFile;

let params;
let clientDH;

let options = {
  host: "localhost",
  path: "/",
  port: 3000,
  method: "GET",
  headers: { "content-type": "application/json" },
};

let setKey_options = {
  host: "localhost",
  path: "/setKey",
  port: 3000,
  method: "POST",
};

let resource_options = {
  host: "localhost",
  path: "/resource",
  port: 3000,
  method: "GET",
};

const req = http.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk.toString("utf-8");
  });

  res.on("end", () => {
    let serverContext = JSON.parse(data);
    clientDH = new ClientDH(serverContext);
    params = JSON.stringify(clientDH.getContext());
    const req2 = http.request(setKey_options, (res) => {
      if (res.statusCode !== 409) {
        const req3 = http.request(resource_options, (res) => {
          if (res.statusCode !== 409) {
            const file = fs.createWriteStream(
              __dirname + "\\files\\client_decrypted_data.txt"
            );
            const key = new Buffer(32);
            let clientSecret = clientDH.getSecret(serverContext);
            clientSecret.copy(key, 0, 0, 32);
            decipherFile(res, file, key);
          }
        });
        req3.on("error", (e) => {
          console.log("http.request: error:", e.message);
        });
        req3.end();
      }
    });
    req2.on("error", (e) => {
      console.log("http.request: error:", e.message);
    });
    console.log(params);
    req2.write(params);
    req2.end();
  });
});

req.on("error", (e) => {
  console.log("http.request: error:", e.message);
});

req.end();
