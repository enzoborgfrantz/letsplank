const Path = require("path");
const { Server, ServerRegisterPluginObject } = require("@hapi/hapi");
const {
  fetchFromDB,
  buildDatabase,
  createOrUpdateUser,
  createPlankRecord,
} = require("./database");

const init = async () => {
  const server = new Server({
    port: +process.env.PORT || 3001,
  });

  await server.register(require("@hapi/inert"));

  server.route({
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: Path.join(__dirname, "..", "frontend", "build"),
      },
    },
  });

  const store = {
    loaded: false,
  };

  server.route({
    method: "GET",
    path: "/DB-load",
    handler: async (request, h) => {
      const response = await fetchFromDB();
      console.log(response);
      return response;
    },
  });

  server.route({
    method: "GET",
    path: "/DB-create",
    handler: async (request, h) => {
      try {
        await buildDatabase();
        return "ok";
      } catch (error) {
        return "error";
      }
    },
  });

  server.route({
    method: "POST",
    path: "/user",
    handler: async (request, h) => {
      const { id, name, profilePhotoUrl } = request.payload;

      try {
        await createOrUpdateUser({
          id,
          name,
          profilePhotoUrl,
        });
        return "ok";
      } catch (error) {
        console.log(error);
        return "error";
      }
    },
  });

  server.route({
    method: "POST",
    path: "/plank",
    handler: async (request, h) => {
      const { userId, durationMS } = request.payload;

      try {
        await createPlankRecord({
          userId,
          durationMS,
        });
        return "ok";
      } catch (error) {
        console.log(error);
        return "error";
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
