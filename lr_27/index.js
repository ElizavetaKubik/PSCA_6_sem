const webdav = require("webdav-server").v2;
const express = require("express");
const fs = require("fs");
const { createClient } = require("webdav");

const client = createClient("https://webdav.yandex.ru", {
  username: "elizavetakubik",
  password: "hhivbzgtzabgdauf",
});

const app = express();

app.post("/md/[A-z,0-9,%,/,.]+", (req, res) => {
  let request = "/" + req.url.split("/")[2];

  let dirName = decodeURI(request);
  client
    .exists(dirName)
    .then((result) => {
      if (!result) {
        client.createDirectory(dirName);
        res.end("Success.");
      } else {
        res.status(408).end("This directory already exists.");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/rd/[A-z,0-9,%,.]+", (req, res) => {
  let request = "/" + req.url.split("/")[2];

  let dirName = decodeURI(request);
  client
    .exists(dirName)
    .then((result) => {
      if (result) {
        client.deleteFile(dirName);
        res.end("Success.");
      } else {
        res.status(404).end("This directory doesn't exist.");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/up/[A-z,0-9,%,.]+", (req, res) => {
  let request = "/" + req.url.split("/")[2];
  let uploadFileName = decodeURI(request);

  try {
    fs.access("./files/" + uploadFileName, function (error) {
      if (error) {
        res.status(408).end("This file doesn't exist.");
      } else {
        let rs = fs.createReadStream("./files/" + uploadFileName);

        let ws = client.createWriteStream(uploadFileName);

        rs.on("open", function () {
          rs.pipe(ws);
          res.end("Success.");
        });

        rs.on("error", function (err) {
          res.end(err);
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(408).end("Error.");
  }
});

app.post("/down/[A-z,0-9,%,.]+", (req, res) => {
  let request = "/" + req.url.split("/")[2];
  let downloadFileName = decodeURI(request);

  client
    .exists(downloadFileName)
    .then((result) => {
      if (result) {
        client
          .createReadStream(downloadFileName)
          .pipe(fs.createWriteStream(`./files/${downloadFileName}`));
        res.end("Success.");
      } else {
        res.status(404).end("This file doesn't exist.");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/del/[A-z,0-9,%,.]+", (req, res) => {
  let request = "/" + req.url.split("/")[2];
  let deleteFileName = decodeURI(request);

  client
    .exists(deleteFileName)
    .then((result) => {
      if (result) {
        client.deleteFile(deleteFileName);
        res.end("Success.");
      } else {
        res.status(404).end("This file doesn't exist.");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/copy/[A-z,0-9,%,.]+/[A-z,0-9,%,.]+", (req, res) => {
  let s = "/" + req.url.split("/")[2];
  let d = "/" + req.url.split("/")[3];
  let fileName = decodeURI(s);
  let destination = decodeURI(d);

  client
    .exists(fileName)
    .then((result) => {
      if (result) {
        if (fileName != destination) {
          client.copyFile(fileName, destination);
          res.end("Success.");
        } else {
          res.status(408).end("Error.");
        }
      } else {
        res.status(404).end("This file doesn't exist.");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(408).end("Error.");
    });
});

app.post("/move/[A-z,0-9,%,.]+/[A-z,0-9,%,.]+", (req, res) => {
  let s = "/" + req.url.split("/")[2];
  let d = "/" + req.url.split("/")[3];
  let source = decodeURI(s);
  let destination = decodeURI(d);

  client
    .exists(source)
    .then((result) => {
      if (result) {
        client.moveFile(source, destination);
        res.end("Success.");
      } else {
        res.status(404).end("This file doesn't exist.");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(process.env.PORT || 4000, () => {
  console.log("App started on 4000 port.");
});
