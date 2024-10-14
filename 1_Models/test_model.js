const db = require("../db/connection");

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    console.log("Hello from model");
    return rows;
  });
};

module.exports = { fetchTopics };
