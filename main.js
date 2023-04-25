const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 5500;
const csvFilePath = 'data.csv';

// cors
app.use(cors())

// Handle API requests
app.get('/', (req, res, next) => {
  const results = [];
  
  // Check if file exists
  if (!fs.existsSync(csvFilePath)) {
    const err = new Error('File not found');
    err.status = 404;
    return next(err);
  }

  const readStream = fs.createReadStream(csvFilePath);

  // Handle file read errors
  readStream.on('error', (err) => {
    console.error(err);
    next(err);
  });

  readStream
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      res.send(results);
    })
    .on('error', (err) => next(err));
});

// Handle file not found errors
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).send({
    error: err.message || 'Internal Server Error'
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
