import { Server, ServerRegisterPluginObject } from "@hapi/hapi";

const init = async () => {
  const server = new Server({
    port: +process.env.PORT || 3001,
    // host: "0.0.0.0",
  });

  server.route({
    method: "GET",
    path: "/",
    handler: async (request, h) => {
      return { status: "ok" };
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
