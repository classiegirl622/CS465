"use strict";

// Database inspection from Node; also verify in MongoDB Compass visually.
const fs = require("node:fs");
const path = require("node:path");
const { connect, disconnect } = require("../app_server/models/db");
const Trip = require("../app_server/models/travlr");

async function main() {
  const seedData = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/trips.json"), "utf8"));
  await connect();
  const records = await Trip.find({}).sort({ code: 1 }).lean();
  const codes = records.map((trip) => trip.code);
  const indexes = await Trip.collection.indexes();
  console.log(JSON.stringify({
    database: Trip.db.name,
    collection: Trip.collection.collectionName,
    count: records.length,
    codes,
    indexes: indexes.map((index) => index.name),
    datesStoredAsDates: records.every((trip) => trip.start instanceof Date),
    allSeedCodesPresent: seedData.every((trip) => codes.includes(trip.code)),
    documents: records.map(({ code, name, start, perPerson }) => ({ code, name, start, perPerson }))
  }, null, 2));
  if (Trip.db.name !== "travlr" || records.length !== seedData.length ||
      !records.every((trip) => trip.start instanceof Date) ||
      !seedData.every((trip) => codes.includes(trip.code))) {
    throw new Error("Database did not match the expected seed data");
  }
  console.log("PASS: travlr.trips matches data/trips.json");
}

main().catch((error) => { console.error("Verification failed:", error.message); process.exitCode = 1; })
  .finally(() => disconnect().catch((error) => { console.error(error); process.exitCode = 1; }));
