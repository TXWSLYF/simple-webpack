const fs = require("fs");
const path = require("path");
const {
  readCode,
  getAllDependencies,
  bundle,
} = require("./src/simple-webpack");

const a = bundle(path.resolve(__dirname, "./example/index.js"));

fs.writeFileSync("./bundle.js", a);
