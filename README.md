
# CSV Parser
This is a simple Express app that allows users to upload CSV files and view their contents.

## Installation

1. Install dependencies by running `npm install`.
2. Set the `PORT` and `UPLOAD_DEST` environment variables if desired.

## Usage

1. Start the server by running `npm run start`.
2. Upload a CSV file by sending a `POST` request to the `/upload` endpoint with the file attached as form data under the key `file`.
3. View the contents of the uploaded CSV file by sending a `GET` request to the `/` endpoint.

## Dependencies

- express
- csv-parser
- fs
- cors
- multer

