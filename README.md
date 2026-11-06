# Travlr Getaways — CS 465 Module One

This is the **customer-facing static website shell** served by **Node.js + Express**. It is based on the `travlr.zip` mockup supplied with the assignment. The Module One rubric does **not** require MongoDB or Angular yet.

## Requirements

- Node.js 18 or newer (includes npm)
- An internet connection the first time you install Express

## Run it locally in VS Code on Windows

1. Extract the ZIP file. Open the extracted **`travlr`** folder in Visual Studio Code (**File > Open Folder**).
2. Open the integrated terminal (**Terminal > New Terminal**).
3. Run:

   ```powershell
   node --version
   npm --version
   npm install
   npm start
   ```

4. Look for the terminal message:

   ```text
   Travlr Getaways Express server running at http://localhost:3000
   ```

5. Open **http://localhost:3000** in your browser. Test Travel, Rooms, Meals, News, About, and Contact through the navigation bar. Your browser should show the Travlr Getaways homepage with the existing CSS and images.
6. For additional server input/output verification, open **http://localhost:3000/health**. Expected JSON:

   ```json
   {"status":"ok","application":"Travlr Getaways"}
   ```

7. Stop the server with `Ctrl+C` in the terminal.

> **Do not double-click `public/index.html` as your server test.** The assignment requires the site to be served over `http://localhost:3000` by Express.

## Test the project

After `npm install`, run:

```powershell
npm test
```

The tests verify that the home page, all seven HTML pages, CSS, logo, `/health`, and missing-page handling respond correctly through the Express server.

## Take the screenshot required by the rubric

1. Start the Express server using `npm start`.
2. Arrange your **browser showing `http://localhost:3000` in its address bar** alongside your **VS Code terminal showing the successful Express server startup message**.
3. Take a screenshot with `Win+Shift+S`, save it as `module1-express-working.png` or another clear filename, and submit it separately from this ZIP unless your instructor instructs otherwise.
4. A `file:///.../index.html` browser address is **not** proof of Express server operation.

## GitHub: create and push the `module1` branch

To follow the assignment's required Git workflow, first **clone the course repository** supplied to you by GitHub/SNHU and create a local branch **before adding the files**:

```powershell
git clone YOUR_GITHUB_REPOSITORY_URL
cd YOUR_REPOSITORY_FOLDER
git switch -c module1
```

Copy the contents of this `travlr` folder (`app.js`, `package.json`, `public`, `tests`, `.gitignore`, `README.md`) to the target website folder inside your local Git clone. If you copy the files to a subfolder, use `cd` to enter that folder for `npm install` and `npm start`.

Run `npm install` to generate `package-lock.json`. Then, from the **repository root**:

```powershell
git status
git add .
git commit -m "Complete CS 465 Module One Express website"
git push -u origin module1
```

If `module1` already exists, run `git switch module1` instead of `git switch -c module1`. **Do not commit `node_modules/`** (it is excluded via `.gitignore`).

## Project layout

```text
travlr/
├── app.js                 Express application/server
├── package.json           Dependencies and npm scripts
├── .gitignore             Excludes node_modules and local files
├── README.md              Setup, tests, screenshot and GitHub instructions
├── tests/
│   └── server.test.js     Automated Express smoke tests
└── public/                Original client-facing website
    ├── index.html
    ├── travel.html
    ├── rooms.html
    ├── meals.html
    ├── news.html
    ├── about.html
    ├── contact.html
    ├── css/style.css
    └── images/             Original images
```

## Changes to the provided mockup

- Copied all seven pages, CSS, and supplied images into `public/`.
- Fixed the homepage image links referencing nonexistent `dives.html` and `foods.html`: they now link to `travel.html` and `meals.html`.
- Corrected invalid curly quotation marks in several `travel.html` HTML link attributes.
- Updated the mismatched travel page title and footer to Travlr Getaways.
- Added a minimal Express server and automated smoke tests.

No actual Express run or GitHub push has been performed as part of creating the ZIP. The Express dependency must be downloaded with `npm install` and launched on your local machine before you take the assignment screenshot.
