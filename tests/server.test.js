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
  await new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
});

async function loadPage(path) {
  const response = await fetch(`${baseUrl}${path}`);
  const html = await response.text();
  return { response, html };
}

test("MVC main controller renders home page with Handlebars layout", async () => {
  const { response, html } = await loadPage("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /text\/html/);
  assert.match(html, /Enjoy the Summer with Us!/);
  assert.match(html, /<title>Home \| Travlr Getaways<\/title>/);
  assert.match(html, /class="selected"[^>]*><a href="\/">Home<\/a>/);
});

test("traveler controller renders /travel using registered header and footer partials", async () => {
  const { response, html } = await loadPage("/travel");
  assert.equal(response.status, 200);
  assert.match(html, /Gale Reef/);
  assert.match(html, /Dawson/);
  assert.match(html, /Claire/);
  assert.match(html, /<div id="header">/);
  assert.match(html, /<div id="footer">/);
  assert.match(html, /class="selected"[^>]*><a href="\/travel">Travel<\/a>/);
  assert.doesNotMatch(html, /\{\{[#>\/]/);
});

test("all seven customer routes render through Handlebars", async () => {
  for (const page of ["/", "/travel", "/rooms", "/meals", "/news", "/about", "/contact"]) {
    const { response, html } = await loadPage(page);
    assert.equal(response.status, 200, `${page} did not load`);
    assert.match(html, /<html lang="en">/, page);
    assert.match(html, /<link rel="stylesheet" href="\/css\/style.css"/, page);
    assert.match(html, /<div id="footer">/, page);
    assert.doesNotMatch(html, /\{\{[#>\/]/, `HBS directive leaked: ${page}`);
  }
});

test("legacy /travel.html URL redirects to controller route", async () => {
  const response = await fetch(`${baseUrl}/travel.html`, { redirect: "manual" });
  assert.equal(response.status, 301);
  assert.equal(response.headers.get("location"), "/travel");
});

test("Express serves CSS and original image assets", async () => {
  const cssResponse = await fetch(`${baseUrl}/css/style.css`);
  assert.equal(cssResponse.status, 200);
  assert.match(cssResponse.headers.get("content-type"), /text\/css/);
  const imageResponse = await fetch(`${baseUrl}/images/logo.png`);
  assert.equal(imageResponse.status, 200);
  assert.match(imageResponse.headers.get("content-type"), /image\/png/);
});

test("contact form explains that email delivery is not implemented", async () => {
  const response = await fetch(`${baseUrl}/contact`, { method: "POST" });
  assert.equal(response.status, 200);
  assert.match(await response.text(), /does not send contact messages/);
});

test("health JSON endpoint remains available", async () => {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    status: "ok", application: "Travlr Getaways"
  });
});

test("unknown paths return a rendered HTTP 404", async () => {
  const { response, html } = await loadPage("/no-such-page");
  assert.equal(response.status, 404);
  assert.match(html, /Page Not Found/);
});


test("Module Three trips.json contains valid trip records and matching image assets", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const root = path.join(__dirname, "..");
  const trips = JSON.parse(fs.readFileSync(path.join(root, "data", "trips.json"), "utf8"));
  assert.equal(Array.isArray(trips), true);
  assert.equal(trips.length, 3);
  for (const trip of trips) {
    for (const field of ["code", "name", "length", "start", "resort", "perPerson", "image", "description"]) {
      assert.equal(typeof trip[field], "string", `Missing ${field} in ${trip.name}`);
      assert.ok(trip[field].length > 0, `Empty ${field} in ${trip.name}`);
    }
    assert.ok(trip.description.includes(trip.name), `Trip description should name ${trip.name}`);
    assert.ok(fs.existsSync(path.join(root, "public", "images", trip.image)), `Missing image ${trip.image}`);
  }
});

test("Travel page dynamically renders all trip titles and descriptions from JSON", async () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const trips = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "trips.json"), "utf8"));
  const { response, html } = await loadPage("/travel");
  assert.equal(response.status, 200);
  const list = html.match(/<ul id="sites">([\s\S]*?)<\/ul>/);
  assert.ok(list, "Expected the trips list");
  assert.equal((list[1].match(/<li>/g) || []).length, trips.length);
  for (const trip of trips) {
    assert.ok(html.includes(trip.name.replace(/'/g, "&#x27;")) || html.includes(trip.name.replace(/'/g, "&#39;")) || html.includes(trip.name), `Missing trip ${trip.name}`);
    assert.ok(html.includes(trip.description.split(": ")[1].slice(0, 30)));
    assert.ok(html.includes(`/images/${trip.image}`));
  }
});

test("Travel page updates when trips.json changes without restarting Express", async () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const jsonPath = path.join(__dirname, "..", "data", "trips.json");
  const original = fs.readFileSync(jsonPath, "utf8");
  try {
    const trips = JSON.parse(original);
    trips[0].name = "Module Three Dynamic Test Destination";
    trips[0].description = "Module Three Dynamic Test Destination from JSON";
    fs.writeFileSync(jsonPath, JSON.stringify(trips, null, 2), "utf8");
    const { response, html } = await loadPage("/travel");
    assert.equal(response.status, 200);
    assert.match(html, /Module Three Dynamic Test Destination/);
  } finally {
    fs.writeFileSync(jsonPath, original, "utf8");
  }
});
