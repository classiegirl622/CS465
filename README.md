# CS 465 Module Three — Travlr Getaways (MVC + JSON + Handlebars)

This project continues the **Module Two** Express MVC + HBS implementation. For Module Three, the Travel page now reads vacation trips from `data/trips.json` and generates its cards with the `{{#each trips}}` Handlebars directive. All seven customer-facing pages, shared layout and partials, stylesheet, and image assets are preserved.

## Windows / VS Code — run and test

Open the `travlr` folder (the folder that contains `package.json`) in VS Code, then use the PowerShell terminal:

```powershell
npm install
npm test
npm start
```

Open `http://localhost:3000/travel` in your browser. Check that **Gale Reef**, **Dawson's Reef**, and **Claire's Reef** appear with photos and that each description starts with the trip name. Navigate to `http://localhost:3000/` to verify the original homepage is intact.

`npm test` includes the eight previous Module Two tests plus three new Module Three tests for the JSON trip fields, generated HTML, and a temporary JSON modification to prove refresh updates the page. The modification test restores `trips.json` in its `finally` block. The tests require dependencies installed through `npm install`.

If `npm` reports `ENOENT package.json`, you are in the wrong directory. Check `pwd` and `dir package.json`.

## Module Three MVC flow

```text
GET /travel
    -> app.js mounts /travel router
    -> app_server/routes/traveler.js
    -> app_server/controllers/travel.js
    -> data/trips.json (parsed to a JavaScript array)
    -> res.render('travel', viewModel('travel', { trips }))
    -> app_server/views/travel.hbs: {{#each trips}} generates trip cards
    -> app_server/views/layouts/layout.hbs and header/footer partials
    -> rendered HTML response
```

## Files changed from Module Two

- `data/trips.json` — **new** trip array, with schema-compatible fields `code`, `name`, `length`, `start`, `resort`, `perPerson`, `image`, `description`, plus optional `details`. Travel package labels/dates/prices are example data used to demonstrate the structure, not published booking offers.
- `app_server/controllers/travel.js` — parses the JSON using `fs.readFileSync` and passes the `trips` array to `res.render`.
- `app_server/controllers/traveler.js` — backwards-compatible alias.
- `app_server/routes/traveler.js` — uses the canonical travel controller.
- `app_server/views/travel.hbs` — `{{#each trips}}` data binding; no hardcoded trip cards.
- `tests/server.test.js` — automated data and MVC rendering tests.
- `package.json` — Module Three metadata; npm dependencies unchanged.

Using the local filesystem on each request is appropriate for this assignment's JSON prototyping. A database connection will be introduced in Module Four. MongoDB and Angular are not needed to complete Module Three.

## Push the `module3` branch into your existing GitHub repo

If your previously pushed Module Two is in `C:\Users\ronda\Documents\CS465_GitHub`, **do not clone or initialize a new repository**. Open PowerShell:

```powershell
cd "$HOME\Documents\CS465_GitHub"
git switch module2
git status
git switch -c module3
```

Before switching, confirm the working tree is clean (or commit any existing work). Extract this ZIP so the files appear in a `travlr` folder, then copy into the clone from wherever you extracted it:

```powershell
robocopy "C:\PATH\TO\EXTRACTED\travlr" "$HOME\Documents\CS465_GitHub" /E /XD .git node_modules
cd "$HOME\Documents\CS465_GitHub"
npm install
npm test
npm start
```

Test in a browser, stop the server with Ctrl+C, and push:

```powershell
git add .
git commit -m "Complete CS 465 Module Three JSON-powered travel page"
git push -u origin module3
```

To create the assignment ZIP from the repo folder (without dependencies or Git metadata):

```powershell
cd "$HOME\Documents\CS465_GitHub"
$dest = "$HOME\Documents\travlr_submission\travlr"
New-Item -ItemType Directory -Path $dest -Force | Out-Null
robocopy . $dest /E /XD .git node_modules .vscode
Compress-Archive -Path $dest -DestinationPath "$HOME\Documents\travlr.zip" -Force
```

Check the archive includes `travlr/data/trips.json` and the `app_server` folder. Upload `travlr.zip` to the course submission.
