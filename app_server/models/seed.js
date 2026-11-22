"use strict";

// Run from the travlr project root: npm run db:seed
// COURSEWORK DATABASE ONLY: every run replaces the entire trips collection.
const fs = require("node:fs");
const path = require("node:path");
const { connect, disconnect } = require("./db");
const Trip = require("./travlr");

async function seedTrips() {
  const filePath = path.resolve(__dirname, "../../data/trips.json");
  const trips = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (!Array.isArray(trips) || trips.length === 0) {
    throw new Error("data/trips.json must contain a nonempty array");
  }
  // Validate every record BEFORE deleting any documents.
  const documents = trips.map((trip) => new Trip(trip));
  await Promise.all(documents.map((doc) => doc.validate()));
  const codes = documents.map((doc) => doc.code);
  if (new Set(codes).size !== codes.length) {
    throw new Error("Every trip code must be unique");
  }

  await connect();
  if (Trip.db.name !== "travlr") {
    throw new Error("Refusing to seed a database other than 'travlr'");
  }
  await Trip.deleteMany({});
  await Trip.insertMany(documents);
  await Trip.init(); // Wait for code/name indexes to be built.
  const count = await Trip.countDocuments();
  console.log(`Seeded ${count} trip(s) into travlr.trips: ${codes.join(", ")}`);
  return count;
}

if (require.main === module) {
  seedTrips()
    .catch((error) => { console.error("Seeding failed:", error.message); process.exitCode = 1; })
    .finally(() => disconnect().catch((error) => { console.error(error); process.exitCode = 1; }));
}
module.exports = { seedTrips };
