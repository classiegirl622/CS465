"use strict";

const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const app = require("../app");

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("home page at / renders the Travlr HTML", async () => {
  const response = await fetch(`${baseUrl}/`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /text\/html/);
  const html = await response.text();
  assert.match(html, /Travlr Getaways/i);
  assert.match(html, /Enjoy the Summer with Us!/);
});

test("all seven original website pages render successfully", async () => {
  const pages = [
    "index.html", "travel.html", "rooms.html", "meals.html",
    "news.html", "about.html", "contact.html"
  ];

  for (const page of pages) {
    const response = await fetch(`${baseUrl}/${page}`);
    assert.equal(response.status, 200, `${page} did not load`);
    const html = await response.text();
    assert.match(html, /<html>/i, `${page} is not HTML`);
  }
});

test("Express serves original CSS and image assets", async () => {
  const cssResponse = await fetch(`${baseUrl}/css/style.css`);
  assert.equal(cssResponse.status, 200);
  assert.match(cssResponse.headers.get("content-type"), /text\/css/);

  const imageResponse = await fetch(`${baseUrl}/images/logo.png`);
  assert.equal(imageResponse.status, 200);
  assert.match(imageResponse.headers.get("content-type"), /image\/png/);
});

test("health endpoint responds with JSON", async () => {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    status: "ok",
    application: "Travlr Getaways"
  });
});

test("missing content returns HTTP 404", async () => {
  const response = await fetch(`${baseUrl}/not-a-page.html`);
  assert.equal(response.status, 404);
});
