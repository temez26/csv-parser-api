const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const app = express();
const port = 5500;
const csvFilePath = 'data.csv';

// Add CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
})

// Handle API requests
app.get('/', (req, res, next) => {
  const results = [];
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
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Handle CSV parse errors
app.use((err, req, res, next) => {
  if (err.message === 'CSV_INVALID_FIELD_COUNT_ERROR') {
    err.status = 400;
  }
  next(err);
});

// Handle all other errors
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).send({
    error: err.message || 'Internal Server Error'
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
