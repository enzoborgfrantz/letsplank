require("dotenv").config();

const { Server, ServerRegisterPluginObject } = require("@hapi/hapi");

// const { Client } = require("pg");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("error", (err, client) => {
  pool.end();
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

pool.on("connect", (client) => {
  console.log("connected");
});

const init = async () => {
  const server = new Server({
    port: +process.env.PORT || 3001,
  });

  server.route({
    method: "GET",
    path: "/",
    handler: async (request, h) => {
      console.log(pool);
      return { status: "jebo ti pas mater" };
    },
  });

  const store = {
    loaded: false,
  };

  server.route({
    method: "GET",
    path: "/DB-load",
    handler: async (request, h) => {
      return "ok";

      // try {
      //   const client = new Client({
      //     connectionString: `${process.env.DATABASE_URL}`,
      //     // connectionString: `${process.env.DATABASE_URL}?ssl=true`,
      //     // ssl: true,
      //     ssl: {
      //       rejectUnauthorized: false,
      //     },
      //   });
      //   console.log(`${process.env.DATABASE_URL}?ssl=true`);
      //   await client.connect();
      //   console.log("connected");
      //   const result = await client.query("SELECT * FROM test_table;");
      //   console.log("result fetched");
      //   await client.end();
      //   console.log("client ended");
      //   return result;
      // } catch (err) {
      //   console.error(err);
      //   return err;
      // }
    },
  });

  server.route({
    method: "GET",
    path: "/DB-read",
    handler: async (request, h) => {
      return store;
    },
  });

  const start = async function () {
    try {
      await server.register({
        plugin: require("hapi-cors"),
        options: {
          origins: ["*"],
        },
      });
      await server.start();
    } catch (err) {
      console.log("server error", err);
      process.exit(1);
    }
  };

  await start();

  try {
    console.log("querying");
    const { rows } = await pool.query("SELECT * FROM test_table;");
    console.log("query success");
    console.log(rows);
  } catch (error) {
    console.log("query error", error);
  }
};

process.on("unhandledRejection", (err) => {
  console.log("unhandled server error", err);
  process.exit(1);
});

init();
