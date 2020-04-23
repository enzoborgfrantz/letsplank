require("dotenv").config();

const { Server, ServerRegisterPluginObject } = require("@hapi/hapi");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: `${process.env.DATABASE_URL}?ssl=true`,
  ssl: true,
});

const init = async () => {
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

  const store = {
    loaded: false,
  };

  server.route({
    method: "GET",
    path: "/DB-load",
    handler: async (request, h) => {
      try {
        console.log(`${process.env.DATABASE_URL}?ssl=true`);
        pool.connect().then((client) => {
          console.log("client connected");
          client
            .query(
              // "SELECT table_schema,table_name FROM information_schema.tables;"
              "SELECT * FROM test_table"
            )
            .then((results) => {
              console.log("query completed");
              store.loaded = true;
              store.data = results;
              client.release();
            });
        });

        return "loading";
      } catch (err) {
        console.error(err);
        return err;
      }
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
};

process.on("unhandledRejection", (err) => {
  console.log("unhandled server error", err);
  process.exit(1);
});

init();
