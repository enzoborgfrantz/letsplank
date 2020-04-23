require("dotenv").config();

const { Server, ServerRegisterPluginObject } = require("@hapi/hapi");

const { Client } = require("pg");

const client = new Client({
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
        await client.connect();

        const result = await client.query("SELECT * FROM test_table;");
        client.end();

        return result;
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
