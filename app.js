"use strict";

const express = require("express");
const path = require("node:path");
const hbs = require("hbs");

const indexRouter = require("./app_server/routes/index");
const travelerRouter = require("./app_server/routes/traveler");
const pagesRouter = require("./app_server/routes/pages");
const apiRouter = require("./app_server/routes/api");
const database = require("./app_server/models/db");
const { viewModel } = require("./app_server/models/site");

const app = express();
const viewsPath = path.join(__dirname, "app_server", "views");

// MVC: routes -> controllers -> presentation model -> Handlebars views.
app.set("views", viewsPath);
app.set("view engine", "hbs");
// hbs.registerPartials is asynchronous. Wait for registration so even the first
// request can resolve the shared partials and partial-block layout reliably.
const partialsReady = Promise.all(
  ["partials", "layouts"].map((folder) => new Promise((resolve, reject) => {
    hbs.registerPartials(path.join(viewsPath, folder), (error) => {
      if (error) reject(error);
      else resolve();
    });
  }))
);

app.use((_req, _res, next) => {
  partialsReady.then(() => next(), next);
});

app.use(express.urlencoded({ extended: false }));
// CSS and images remain static, but all pages now render via the HBS engine.
app.use(express.static(path.join(__dirname, "public"), { index: false }));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", application: "Travlr Getaways" });
});

// The traveler controller is registered under /travel as required by Module Two.
app.use("/", indexRouter);
app.use("/travel", travelerRouter);
app.use("/api", apiRouter);
app.use("/", pagesRouter);

app.use((_req, res) => {
  res.status(404).render("not-found", viewModel(null));
});

module.exports = app;

if (require.main === module) {
  const port = Number.parseInt(process.env.PORT, 10) || 3000;
  // Connect before listening so API requests only run against a ready database.
  database.connect().then(() => {
    const server = app.listen(port, () => {
      console.log(`Travlr Getaways running at http://localhost:${port}`);
      console.log(`JSON trips: http://localhost:${port}/api/trips`);
    });
    async function stop() {
      server.close();
      try { await database.disconnect(); } catch (error) { console.error(error); }
      process.exit(0);
    }
    process.once("SIGINT", stop);
    process.once("SIGTERM", stop);
  }).catch((error) => {
    console.error("Could not start Travlr: MongoDB connection failed.", error.message);
    console.error("Check that MongoDB Community Server is running at 127.0.0.1:27017.");
    process.exitCode = 1;
  });
}
