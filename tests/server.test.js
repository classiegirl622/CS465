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
