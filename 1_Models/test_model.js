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

const fetchArticlesById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      }
      return result.rows[0];
    });
};

module.exports = { fetchTopics, fetchEndpoints, fetchArticlesById };
