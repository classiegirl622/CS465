# Module Four Verification Status

## Completed in the build environment (2026-11-22)

- JavaScript source passed `node --check` for every `.js` source file.
- `data/trips.json` parsed successfully and contained 3 trip records.
- All 8 required trip fields were present and nonempty in all 3 records.
- Trip dates were valid ISO calendar dates and referenced image assets existed.
- ZIP packaging and archive integrity verified.

## Still to run on a Windows machine with MongoDB and NPM access

- `npm install` to download Node dependencies (the isolated build environment could not contact the NPM registry).
- `npm test` to run existing MVC tests and new offline Mongoose validation tests.
- `npm run db:seed` against an actual MongoDB Community Server.
- `npm run db:verify` to validate persisted documents and indexes.
- Confirm the 3 documents in MongoDB Compass, screenshot the collection for evidence.
- Start the site and check `/api/trips` returns database-backed JSON.
- Commit and push the `module4` branch to the user's GitHub repository.

Do not claim the MongoDB database has been populated or verified until the local commands and Compass check succeed.
