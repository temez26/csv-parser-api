
function getData() {
  return fetch("http://localhost:5500")
    .then((response) => response.json())
    .then((data) => {
      const table = document.getElementById("csvTable");
      const headers = Object.keys(data[0]);
      const headerRow = document.createElement("tr");
      headers.forEach((headerText) => {
        const header = document.createElement("th");
        header.appendChild(document.createTextNode(headerText));
        headerRow.appendChild(header);
      });
      table.appendChild(headerRow);
      data.forEach((rowData) => {
        const row = document.createElement("tr");
        headers.forEach((headerText) => {
          const cell = document.createElement("td");
          cell.appendChild(document.createTextNode(rowData[headerText]));
          row.appendChild(cell);
        });
        table.appendChild(row);
      });
      return data;
    });
}

getData();


document.getElementById("file-input").addEventListener("change", function (e) {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append("file", file);

  fetch("http://localhost:5500/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      const table = document.getElementById("csvTable");
      table.innerHTML = ""; // clear the contents of the table
      const headers = Object.keys(data[0]);
      const headerRow = document.createElement("tr");
      headers.forEach((headerText) => {
        const header = document.createElement("th");
        header.appendChild(document.createTextNode(headerText));
        headerRow.appendChild(header);
      });
      table.appendChild(headerRow);
      data.forEach((rowData) => {
        const row = document.createElement("tr");
        headers.forEach((headerText) => {
          const cell = document.createElement("td");
          cell.appendChild(document.createTextNode(rowData[headerText]));
          row.appendChild(cell);
        });
        table.appendChild(row);
      });
    });
});

