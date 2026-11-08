"use strict";

const express = require("express");
const path = require("node:path");
const hbs = require("hbs");

const indexRouter = require("./app_server/routes/index");
const travelerRouter = require("./app_server/routes/traveler");
const pagesRouter = require("./app_server/routes/pages");
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
app.use("/", pagesRouter);

app.use((_req, res) => {
  res.status(404).render("not-found", viewModel(null));
});

module.exports = app;

if (require.main === module) {
  const port = Number.parseInt(process.env.PORT, 10) || 3000;
  app.listen(port, () => {
    console.log(`Travlr Getaways MVC + HBS server running at http://localhost:${port}`);
  });
}
