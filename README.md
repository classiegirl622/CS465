# CS 465 Module Four — Travlr Getaways (MongoDB + Mongoose)

This is the verified Module Three Travlr MVC/HBS site updated to meet **Module Four: NoSQL Databases, Models, and Schemas** in the SNHU Full Stack Guide (pp. 95–102). The preexisting pages, `{{#each trips}}` rendering, and sample images are preserved. The three example trip descriptions are now readable English instead of Latin placeholder text.

## Rubric mapping

| Requirement | Implemented file |
| --- | --- |
| Database access module | `app_server/models/db.js` connects to `mongodb://127.0.0.1:27017/travlr` using Mongoose. |
| Mongoose schema with validation | `app_server/models/travlr.js` defines 8 required fields, `start: Date`, indexed `code` and `name`, and a `trips` collection. |
| Retrieve database trips as JSON | `GET /api/trips` and `GET /api/trips/:code` through `app_server/controllers/tripsApi.js`. This read-only route is an early preview of Module Five. |
| Populate database | `data/trips.json` and `app_server/models/seed.js` seed three trip records. |
| Test loaded documents | `npm run db:verify`, then visually check `travlr > trips` in MongoDB Compass and take screenshots. |

**Important:** The database contents do not travel inside a ZIP. `trips.json` and the seed script are included so you can create the collection on your own Windows computer. No MongoDB Compass screenshot or live MongoDB verification is claimed by the provided files. Your Module Four guide expects you to perform and capture that check.

## 1. Install requirements (Windows)

- Node.js 18 or later with NPM
- MongoDB Community Server running as a local Windows service on port 27017
- MongoDB Compass to inspect the database
- VS Code and Git (for the course repository)

Open the extracted **`travlr`** folder in VS Code—the folder that contains `package.json`. In its PowerShell terminal:

```powershell
Get-Location
Get-ChildItem package.json
npm install
npm test
```

Check your MongoDB service if connection fails (run in an Administrator PowerShell window when necessary):

```powershell
Get-Service *MongoDB*
# If stopped, start the service using the name shown above:
# Start-Service MongoDB
```

## 2. Seed the local database

```powershell
npm run db:seed
```

This runs `node app_server/models/seed.js`, creates the `travlr` database and `trips` collection if absent, and writes **3 trips**: `GALEREEF`, `DAWSON`, and `CLAIRE`. **Rerunning the seed script deletes/replaces all existing documents in `travlr.trips`. Do not point this coursework script at production data.** It validates the sample documents before deleting any records.

Verify from Node:

```powershell
npm run db:verify
```

Expected final line: `PASS: travlr.trips matches data/trips.json`. The report includes indexes and confirms `start` is a BSON date (represented as a JS `Date`).

## 3. Verify with MongoDB Compass (rubric testing)

1. Start **MongoDB Compass**.
2. Enter `mongodb://127.0.0.1:27017` and select **Connect**.
3. Open the **`travlr`** database, then the **`trips`** collection.
4. Confirm that exactly **3 documents** appear: `GALEREEF`, `DAWSON`, and `CLAIRE`.
5. Expand a document. Verify `code`, `name`, `length`, `start` (Date), `resort`, `perPerson`, `image`, and `description`.
6. On the **Indexes** tab, check that indexes exist for `code` and `name` in addition to `_id`.
7. **Capture a screenshot** of the `travlr.trips` document view showing the 3 documents. Optionally capture the Indexes tab as separate evidence. Screenshots cannot be generated from this ZIP because they must reflect your actual database.

## 4. Test the server's MongoDB JSON output

With MongoDB still running:

```powershell
npm start
```

Open the following in a browser:

- `http://localhost:3000/api/trips` — JSON list of all three records queried with Mongoose
- `http://localhost:3000/api/trips/GALEREEF` — one JSON record by trip code
- `http://localhost:3000/travel` — existing customer-facing dynamic HBS page using `trips.json`
- `http://localhost:3000/health` — health endpoint

The Module Four guide retains the JSON-file-based customer travel page; the API route is included as a preview to make database JSON retrieval testable now. The guide's **Module Five** changes the web page to read from the API.

## 5. Push the `module4` Git branch

Use **your existing CS465 GitHub repository**, not a new Git repository. From your existing repo's working copy, after completing/pushing Module Three:

```powershell
git status
git switch module3
git switch -c module4
```

Copy the **contents** of this ZIP's `travlr` folder into the existing repository folder, without overwriting `.git`. From your repository root:

```powershell
npm install
npm test
npm run db:seed
npm run db:verify
git add .
git commit -m "Complete CS 465 Module Four MongoDB and Mongoose"
git push -u origin module4
```

If `module4` already exists, use `git switch module4` instead of `git switch -c module4`. Check `git status` before and after copying. Do not copy `.git`, `node_modules`, or private `.env` files.

## Submission

Upload the provided **`travlr.zip`** to Brightspace. It contains the `travlr` folder, all code/assets/tests, and **`travlr/data/trips.json`**. It excludes `node_modules` and `.git`. After extraction, `npm install` recreates dependencies.

## Implementation notes

- `MONGODB_URI` can override the default local MongoDB connection string; the seed script refuses to write to any database named other than `travlr`.
- `DB_HOST` is optional for changing the host when `MONGODB_URI` is not supplied.
- The sample prices, destinations, and dates are demonstration data rather than real vacation offers.
- New Mongoose tests use `node:test` and do not require MongoDB for offline schema validation. Live data seeding, DB inspection, and successful JSON read tests require a running MongoDB instance.
