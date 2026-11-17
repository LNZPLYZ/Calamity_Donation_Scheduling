/* Global defaults and reusable colors keep the page styles consistent. */
:root {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
  color: #23332d;
  background: #f5f4ed;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 400;

  --color-ink: #23332d;
  --color-muted: #68746d;
  --color-green: #315d47;
  --color-green-dark: #244b3b;
  --color-border: #e2e6df;
  --color-surface: #fff;
  --page-width: 1100px;
}

* {
  /* Include padding and borders in an element's declared size. */
  box-sizing: border-box;
}

/* Base page sizing and typography. */
html {
  min-width: 320px;
  min-height: 100%;
}

body {
  min-width: 320px;
  min-height: 100vh;
  margin: 0;
  line-height: 1.6;
}

button,
input,
select,
textarea {
  font: inherit;
}

button,
a {
  -webkit-tap-highlight-color: transparent;
}

a {
  color: var(--color-green);
  text-decoration: none;
}

a:hover {
  color: var(--color-green-dark);
}

button {
  cursor: pointer;
}

button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 3px solid #9bb9a3;
  outline-offset: 3px;
}

#root {
  min-height: 100vh;
}

/* Shared header, content width, and home-page spacing. */
header {
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}

.container,
.pages {
  width: min(calc(100% - 2rem), var(--page-width));
  margin-inline: auto;
}

header h1 {
  margin: 0;
  color: var(--color-green-dark);
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  line-height: 1.25;
}

.home {
  padding-block: clamp(2rem, 6vw, 4rem);
}

/* Donation cards use a responsive grid that adapts to the available width. */
.donations {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  gap: 1rem;
}

.donation-details,
.donations > p {
  margin: 0;
  padding: 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  background: var(--color-surface);
  box-shadow: 0 0.5rem 1.5rem rgba(35, 51, 45, 0.05);
}

.donation-details h2,
.donation-details h3 {
  margin: 0 0 0.75rem;
  color: var(--color-green-dark);
  font-size: 1.15rem;
}

.donation-details p {
  margin: 0.25rem 0 0;
  color: var(--color-muted);
}

/* Keep the title and cards comfortable to read on narrow screens. */
@media (max-width: 480px) {
  header {
    padding-block: 1rem;
  }

  .container,
  .pages {
    width: min(calc(100% - 1.5rem), var(--page-width));
  }
}
