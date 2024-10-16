const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";
const path = `${__dirname}/../.env.${ENV}`;
require("dotenv").config({ path: path });

// console.log(`the ENV is ${ENV}`);
// console.log(`the path is ${path}`);

if (!process.env.PGDATABASE) {
  throw new Error("PGDATABASE not set");
}

module.exports = new Pool();
