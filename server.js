const express = require("express");
const csv = require("csv-parser");
const fs = require("fs");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5500;
const multer = require("multer");
const upload = multer({ dest: process.env.UPLOAD_DEST || "uploads/" });

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

let csvData = [];

// POST route for uploading a CSV file
app.post("/upload", upload.single("file"), async (req, res, next) => {
  try {
    const results = [];
    const csvFilePath = req.file.path;

    // Validate file type
    if (req.file.mimetype !== "text/csv") {
      throw new Error("Invalid file type. Please upload a CSV file.");
    }

    const readStream = fs.createReadStream(csvFilePath);

    // Handle file read errors
    readStream.on("error", (err) => {
      console.error(err);
      res.status(400).send('Error reading file');
    });

    // Parse CSV data and store in memory
    readStream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        csvData = results;
        res.send(results);
      })
      .on("error", (err) => {
        console.error(err);
        res.status(400).send('Error parsing CSV data');
      });
  } catch (err) {
    next(err);
  }
});

// GET route for retrieving parsed CSV data
app.get("/", (req, res) => {
  res.json(csvData);
});

// Error-handling middleware function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server and listen on specified port
app.listen(port, () => {
  console.log(`Server running on port ${ port } `);
});