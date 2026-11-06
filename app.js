"use strict";

const express = require("express");
const path = require("node:path");

const app = express();
const publicDirectory = path.join(__dirname, "public");

// Express serves index.html automatically at / and makes all website assets
// available at URLs such as /css/style.css and /images/logo.png.
app.use(express.static(publicDirectory));

// An additional endpoint provides an easy input/output server test.
app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok", application: "Travlr Getaways" });
});

app.use((_request, response) => {
  response.status(404).send("Page not found");
});

// Export app for smoke tests without opening a second fixed-port listener.
module.exports = app;

if (require.main === module) {
  const port = Number.parseInt(process.env.PORT, 10) || 3000;
  app.listen(port, () => {
    console.log(`Travlr Getaways Express server running at http://localhost:${port}`);
  });
}
