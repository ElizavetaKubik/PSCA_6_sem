const express = require("express");
const multer = require("multer");
const openssl = require("openssl-nodejs");

const app = express();

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "files");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
app.use(multer({ storage: storageConfig }).single("filedata"));

app.get("/", function (req, res) {
  res.setHeader("content-type", "text/html;charset=utf-8");
  res.write(
    '<form action="/upload" method="POST" enctype="multipart/form-data" >'
  );
  res.write('<input type="file" name="filedata">');
  res.write('<input type="submit">');
  res.write("</form>");
  res.end();
});

app.get("/1", (req, res) => {
  res.download(__dirname + "\\security\\CA-LAB25-KEV.crt");
});
app.get("/2", (req, res) => {
  res.download(__dirname + "\\security\\LAB25-KMS.crt");
});
app.get("/3", (req, res) => {
  res.download(__dirname + "\\security\\RS-LAB25-KEV.csr");
});

app.post("/upload", (req, res) => {
  let filedata = req.file;
  if (!filedata) res.send("Ошибка при загрузке файла");
  else {
    res.send("Файл загружен.");
  }
});

app.all("/*", (req, res) => {
  res.status(404);
  res.end("Wrong URL.");
});

app.listen(process.env.PORT || 9900, () => {
  console.log("Started on 9900 port.");
});
