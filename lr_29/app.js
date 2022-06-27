const express = require("express");
const app = express();
const fs = require("fs");

let wasmCode = fs.readFileSync(__dirname + "\\p.wasm");
let wasmImport = {};
let wasmModule = new WebAssembly.Module(wasmCode);
let wasmInstance = new WebAssembly.Instance(wasmModule, wasmImport);

app.get("/3", (req, res) => {
  res
    .type("html")
    .send(
      `sum(3,7) = ${wasmInstance.exports.sum(3, 7)}<br>` +
        `sub(3,7) = ${wasmInstance.exports.sub(3, 7)}<br>` +
        `mul(3,7) = ${wasmInstance.exports.mul(3, 7)}<br>` +
        `div(7,3) = ${wasmInstance.exports.div(7, 3)}<br>`
    );
});

app.listen(5000, () => {
  console.log("Started on 5000 port.");
});

//https://wasdk.github.io/WasmFiddle/
