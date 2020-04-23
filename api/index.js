const { Server, ServerRegisterPluginObject } = require("@hapi/hapi");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: `${process.env.DATABASE_URL}?ssl=true`,
  ssl: true,
});

const init = async () => {
  const client = await pool.connect();
  const server = new Server({
    port: +process.env.PORT || 3001,
  });

  server.route({
    method: "GET",
    path: "/",
    handler: async (request, h) => {
      return { status: "jebo ti pas mater" };
    },
  });

  server.route({
    method: "GET",
    path: "/DB",
    handler: async (request, h) => {
      try {
        console.log(`${process.env.DATABASE_URL}?ssl=true`);

        const result = await client.query(
          // "SELECT table_schema,table_name FROM information_schema.tables;"
          "SELECT * FROM test_table"
        );
        const results = { results: result ? result.rows : null };
        return results;
      } catch (err) {
        console.error(err);
        return err;
      }
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
      client.release();
      console.log("server error", err);
      process.exit(1);
    }
  };

  await start();
};

process.on("unhandledRejection", (err) => {
  console.log("unhandled server error", err);
  client.release();
  process.exit(1);
});

init();
