require("dotenv").config();
const { Pool } = require("pg");

const connectionString = `${process.env.DATABASE_URL}?sslmode=require`;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const fetchFromDB = async () => {
  try {
    console.log("querying");
    console.log(connectionString);
    const client = await pool.connect();
    const { rows } = await client.query("SELECT * FROM test_table;");
    console.log("query success");
    client.release();
    return rows;
  } catch (error) {
    console.log("query error", error);
  }
};

module.exports = { fetchFromDB };
