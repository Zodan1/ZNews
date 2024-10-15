const db = require("../db/connection");
const fs = require("fs");

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    // console.log("Hello from model");
    return rows;
  });
};

const fetchEndpoints = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("endpoints.json", "utf8", (err, endpointsData) => {
      if (err) reject(err);
      // console.log(endpointsData);
      resolve(JSON.parse(endpointsData));
    });
  });
};

module.exports = { fetchTopics, fetchEndpoints };
