

const express = require("express");
const csv = require("csv-parser");
const fs = require("fs");
const cors = require("cors");
const app = express();
const port = 5500;
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// cors
app.use(cors());

let csvData = [];

app.post("/upload", upload.single("file"), (req, res, next) => {
  const results = [];
  const csvFilePath = req.file.path;

  const readStream = fs.createReadStream(csvFilePath);

  // Handle file read errors
  readStream.on("error", (err) => {
    console.error(err);
    next(err);
  });

  readStream
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      csvData = results;
      res.send(results);
    })
    .on("error", (err) => next(err));
});

app.get("/", (req, res) => {
  res.json(csvData);
});

app.listen(port, () => {
  console.log(`Server running on port ${ port } `);
});

