# CS 465 Module Two — Travlr Getaways MVC + Handlebars

This is the **Module Two continuation** of the Module One Express website. The static HTML mockup has been reorganized into an MVC-style application, with shared Handlebars layouts/partials, routes, controllers, and a small presentation model. All seven original website pages retain the supplied CSS and images.

## Requirements

- Node.js 18+ and npm
- A network connection to install Express and `hbs` dependencies

## How to run on Windows (PowerShell / VS Code)

1. Extract this ZIP and open the inner `travlr` directory in VS Code.
2. Open a PowerShell terminal **inside that directory** (the one containing `package.json`).
3. Run:

   ```powershell
   npm install
   npm start
   ```

4. Visit **http://localhost:3000/** for the homepage, and **http://localhost:3000/travel** for the required traveler controller and HBS template demonstration. Navigation works for all seven pages.
5. Keep the server running. In a **second terminal** in the same directory, run:

   ```powershell
   npm test
   ```

6. To stop the server, press `Ctrl+C` in the server terminal.

If you get `ENOENT ... package.json`, run `pwd` and `dir package.json`, then `cd` to the folder containing `package.json` before trying npm again.

## MVC design

```text
travlr/
├── app.js                        Express entry, HBS registration, router mounting
├── package.json                  Express and hbs dependencies
├── app_server/
│   ├── models/
│   │   └── site.js               Presentation model: site metadata and navigation
│   ├── controllers/
│   │   ├── main.js               Homepage controller
│   │   ├── traveler.js           Travel page controller
│   │   ├── travel.js             Alias for later course guide compatibility
│   │   └── pages.js              Other customer-facing page controllers
│   ├── routes/
│   │   ├── index.js              GET /
│   │   ├── traveler.js           GET /travel
│   │   └── pages.js              Other routes and legacy .html redirects
│   └── views/
│       ├── layouts/layout.hbs    Shared HTML page skeleton
│       ├── partials/header.hbs   Shared logo/navigation
│       ├── partials/footer.hbs   Shared footer/navigation
│       ├── index.hbs             Homepage view
│       ├── travel.hbs            Travel view (original trips preserved)
│       ├── rooms.hbs             Rooms view
│       ├── meals.hbs             Meals view
│       ├── news.hbs              News view
│       ├── about.hbs             About view
│       ├── contact.hbs           Contact view
│       └── not-found.hbs         404 view
├── public/
│   ├── css/style.css            Original stylesheet
│   └── images/                  Original website images
└── tests/server.test.js         HTTP and template-rendering tests
```

The MVC flow is **HTTP request -> router -> controller -> presentation model -> Handlebars view -> rendered HTML response**. Header/footer navigation uses `{{#each navigation}}` and `{{#if isCurrent}}`; individual pages use the `{{#> layout}}...{{/layout}}` partial-block directive. The master layout uses `{{> header}}`, `{{> @partial-block}}`, and `{{> footer}}`.

**Module Three note:** Trip descriptions remain hardcoded in `travel.hbs`. Module Three will replace them with JSON + `{{#each trips}}`, then MongoDB is introduced in later modules. This assignment does not require Angular or MongoDB.

## Moving Module Two into your existing GitHub repository

Your prior Module One project was committed to `module1` in `C:\Users\ronda\Documents\CS465_GitHub`.
Keep that branch intact and create Module Two from it **before copying these files**.

```powershell
cd "$HOME\Documents\CS465_GitHub"
git fetch origin
git switch module1
git pull --ff-only origin module1
git switch -c module2
```

If `module2` already exists locally, use `git switch module2` instead of creating it again.

Extract the ZIP to `$HOME\Documents\CS465_Module2`, so its files are in `$HOME\Documents\CS465_Module2\travlr`. Then copy the project into the GitHub clone (without `.git` or `node_modules`):

```powershell
robocopy "$HOME\Documents\CS465_Module2\travlr" "$HOME\Documents\CS465_GitHub" /E /XD .git node_modules
```

Robocopy may exit with code 1 even on success; check the `FAILED` column in its summary. Remove the original static HTML copies from the cloned `public` folder, otherwise the old `/travel.html` will bypass HBS when served as a static file:

```powershell
Remove-Item "$HOME\Documents\CS465_GitHub\public\*.html" -ErrorAction SilentlyContinue
cd "$HOME\Documents\CS465_GitHub"
npm install
npm test
npm start
```

Take a screenshot of your locally rendered **http://localhost:3000/travel** page next to the successful terminal output if you want to document your test. Module Two's stated submission is the project ZIP.

In a second terminal (or stop `npm start` with `Ctrl+C`), commit and push:

```powershell
cd "$HOME\Documents\CS465_GitHub"
git status
git add .
git commit -m "Complete CS 465 Module Two MVC and HBS"
git push -u origin module2
```

**Submitting:** Upload this ZIP file to Brightspace. It already includes `app_server` and the updated Express project. Do not include your `node_modules` directory. `package-lock.json` will be regenerated by `npm install` because the HBS dependency has been added to the Module One application.

## Scope notes

- Legacy `.html` page links redirect to the new controller routes (for example, `/travel.html` redirects to `/travel`).
- The contact form is still only a coursework demo; it returns an explanation rather than sending email.
- The original Travlr mockup's filler text remains in place to match Module One and the provided design.
