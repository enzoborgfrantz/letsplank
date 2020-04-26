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
    const { rows } = await client.query("SELECT * FROM planks;");
    console.log("query success");
    client.release();
    return rows;
  } catch (error) {
    console.log("query error", error);
  }
};

// const getCreateTableQuery = (tableName: string, schema: string) =>
const getCreateTableQuery = (tableName, schema) =>
  `CREATE TABLE ${tableName} (${schema});`;

const usersTableName = "users";
const userTableSchema = `id VARCHAR(100) UNIQUE, name VARCHAR(100) NOT NULL, profile_photo_url VARCHAR(255)`;
const planksTableName = "planks";
const plankTableSchema = `duration_ms INTEGER, date_submitted TIMESTAMP, user_id VARCHAR(100) REFERENCES ${usersTableName} (id)`;

const buildDatabase = async () => {
  const createUsersTableQuery = getCreateTableQuery(
    usersTableName,
    userTableSchema
  );
  const createPlanksTableQuery = getCreateTableQuery(
    planksTableName,
    plankTableSchema
  );

  const query = `DROP TABLE IF EXISTS ${planksTableName}, ${usersTableName} CASCADE; ${createUsersTableQuery} ${createPlanksTableQuery}`;

  try {
    const client = await pool.connect();
    const result = await client.query(query);
    client.release();
    return Promise.resolve();
  } catch (error) {
    Promise.reject(error);
  }
};

const createOrUpdateUser = async ({ id, name, profilePhotoUrl }) => {
  const query = `INSERT INTO ${usersTableName}(name, profile_photo_url, id) VALUES('${name}', '${profilePhotoUrl}', '${id}')
  on conflict(id)
  do UPDATE SET name='${name}', profile_photo_url='${profilePhotoUrl}';`;
  try {
    const client = await pool.connect();
    const id = await client.query(query);
    client.release();
    return Promise.resolve();
  } catch (error) {
    Promise.reject(error);
  }
};

const createPlankRecord = async ({ userId, durationMS }) => {
  // something is wrong with current timestamp
  const query = `INSERT INTO ${planksTableName}(duration_ms, date_submitted, user_id) VALUES(${durationMS}, CURRENT_TIMESTAMP, ${userId})`;
  try {
    const client = await pool.connect();
    const id = await client.query(query);
    client.release();
    return Promise.resolve();
  } catch (error) {
    Promise.reject(error);
  }
};

module.exports = {
  fetchFromDB,
  buildDatabase,
  createOrUpdateUser,
  createPlankRecord,
};
