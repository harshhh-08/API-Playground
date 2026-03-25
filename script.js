/**
 * script.js — Public API Playground
 * ===================================
 * Modular, async/await-based API integrations:
 *  1. Dog Finder       → dog.ceo
 *  2. Joke Generator   → official-joke-api.appspot.com
 *  3. Random User      → randomuser.me
 *  4. Motivation Quote  → dummyjson.com
 *
 * Also includes a light/dark theme toggle persisted to localStorage.
 */

'use strict';

/* ============================================================
   SECTION 0 — SHARED UI HELPERS
   ============================================================ */

/**
 * showLoading — Renders a spinner + "Loading…" text and disables button.
 * @param {HTMLElement} statusEl — Status container
 * @param {HTMLElement} btnEl    — Button to disable
 */
function showLoading(statusEl, btnEl) {
  statusEl.innerHTML = `
    <div class="loading-indicator">
      <div class="spinner"></div>
      <span>Loading…</span>
    </div>`;
  if (btnEl) btnEl.disabled = true;
}

/**
 * showError — Renders an error message and re-enables the button.
 * @param {HTMLElement} statusEl
 * @param {HTMLElement} btnEl
 * @param {string}      [msg]
 */
function showError(statusEl, btnEl, msg = 'Something went wrong. Please try again.') {
  statusEl.innerHTML = `
    <div class="error-message">
      <span>⚠️</span>
      <span>${msg}</span>
    </div>`;
  if (btnEl) btnEl.disabled = false;
}

/**
 * clearStatus — Empties the status area and re-enables button.
 */
function clearStatus(statusEl, btnEl) {
  statusEl.innerHTML = '';
  if (btnEl) btnEl.disabled = false;
}

/**
 * fetchJSON — Generic async fetch wrapper; throws on non-OK responses.
 * @param {string} url
 * @returns {Promise<any>}
 */
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/**
 * escapeHtml — Prevents XSS from API-returned strings.
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return String(str);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}


/* ============================================================
   SECTION 1 — THEME TOGGLE
   Persisted in localStorage. Default = dark.
   ============================================================ */

/**
 * toggleTheme — Switches between "dark" and "light" data-theme on <html>.
 */
function toggleTheme() {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

// On load: apply saved theme preference (if any)
(function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
})();


/* ============================================================
   SECTION 2 — DOG FINDER
   API: https://dog.ceo/api/breeds/image/random
   ============================================================ */

const dog = { currentImageUrl: null };

/**
 * fetchDog — Fetches a random dog image and extracts breed from the URL.
 */
async function fetchDog() {
  const statusEl = document.getElementById('dog-status');
  const btnEl    = document.getElementById('dog-btn');
  const contentEl = document.getElementById('dog-content');
  const copyBtn  = document.getElementById('dog-copy-btn');

  copyBtn.style.display = 'none';
  dog.currentImageUrl = null;
  showLoading(statusEl, btnEl);

  try {
    const data = await fetchJSON('https://dog.ceo/api/breeds/image/random');
    if (data.status !== 'success') throw new Error('Unsuccessful response');

    const imageUrl = data.message;

    // Extract breed from URL: .../breeds/{breed-name}/filename.jpg
    const breedRaw   = imageUrl.split('/breeds/')[1]?.split('/')[0] ?? 'unknown';
    const breedClean = breedRaw.replace(/-/g, ' ');

    dog.currentImageUrl = imageUrl;

    contentEl.innerHTML = `
      <div class="dog-result">
        <img class="dog-img" src="${imageUrl}" alt="A ${breedClean} dog" loading="lazy" />
        <p class="dog-breed-label">🐕 ${breedClean}</p>
      </div>`;

    copyBtn.style.display = 'inline-flex';
    clearStatus(statusEl, btnEl);

  } catch (err) {
    contentEl.innerHTML = `<div class="empty-state"><span class="empty-icon">🐶</span><p>Click below to fetch a dog</p></div>`;
    showError(statusEl, btnEl, `Could not fetch dog image. ${err.message}`);
  }
}

/**
 * copyDogUrl — Copies the current dog image URL to clipboard.
 */
async function copyDogUrl() {
  if (!dog.currentImageUrl) return;
  const btn = document.getElementById('dog-copy-btn');

  try {
    await navigator.clipboard.writeText(dog.currentImageUrl);
    const orig = btn.textContent;
    btn.textContent = '✓ Copied!';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 2000);
  } catch {
    alert('Copy failed. URL:\n' + dog.currentImageUrl);
  }
}


/* ============================================================
   SECTION 3 — JOKE GENERATOR
   API: https://official-joke-api.appspot.com/random_joke
   ============================================================ */

/**
 * fetchJoke — Fetches a random joke (setup + punchline).
 */
async function fetchJoke() {
  const statusEl  = document.getElementById('joke-status');
  const btnEl     = document.getElementById('joke-btn');
  const contentEl = document.getElementById('joke-content');
  const nextBtn   = document.getElementById('joke-next-btn');

  nextBtn.disabled = true;
  showLoading(statusEl, btnEl);

  try {
    const data = await fetchJSON('https://official-joke-api.appspot.com/random_joke');

    contentEl.innerHTML = `
      <div class="joke-result">
        <p class="joke-label">Setup</p>
        <p class="joke-setup">${escapeHtml(data.setup)}</p>
        <div class="joke-divider"></div>
        <p class="joke-label">Punchline</p>
        <p class="joke-punchline">${escapeHtml(data.punchline)} 😄</p>
      </div>`;

    nextBtn.style.display = 'inline-flex';
    clearStatus(statusEl, btnEl);
    nextBtn.disabled = false;

  } catch (err) {
    contentEl.innerHTML = `<div class="empty-state"><span class="empty-icon">😂</span><p>Click below to get a joke</p></div>`;
    nextBtn.disabled = false;
    showError(statusEl, btnEl, `Could not fetch joke. ${err.message}`);
  }
}


/* ============================================================
   SECTION 4 — RANDOM USER
   API: https://randomuser.me/api/
   ============================================================ */

/**
 * fetchUser — Fetches a random user profile (name, avatar, email, country, phone, age).
 */
async function fetchUser() {
  const statusEl  = document.getElementById('user-status');
  const btnEl     = document.getElementById('user-btn');
  const contentEl = document.getElementById('user-content');

  showLoading(statusEl, btnEl);

  try {
    const data = await fetchJSON('https://randomuser.me/api/');
    const u = data.results[0];

    const fullName = `${u.name.first} ${u.name.last}`;

    contentEl.innerHTML = `
      <div class="user-result">
        <img class="user-avatar" src="${u.picture.large}" alt="${escapeHtml(fullName)}" loading="lazy" />
        <div class="user-info">
          <p class="user-name">${escapeHtml(fullName)}</p>
          <div class="user-row"><span class="user-row-icon">📧</span><span>${escapeHtml(u.email)}</span></div>
          <div class="user-row"><span class="user-row-icon">🌍</span><span>${escapeHtml(u.location.country)}</span></div>
          <div class="user-row"><span class="user-row-icon">📞</span><span>${escapeHtml(u.phone)}</span></div>
          <div class="user-row"><span class="user-row-icon">🎂</span><span>${u.dob.age} years old</span></div>
        </div>
      </div>`;

    clearStatus(statusEl, btnEl);

  } catch (err) {
    contentEl.innerHTML = `<div class="empty-state"><span class="empty-icon">👤</span><p>Click below to discover someone</p></div>`;
    showError(statusEl, btnEl, `Could not fetch user. ${err.message}`);
  }
}


/* ============================================================
   SECTION 5 — MOTIVATION GENERATOR
   API: https://dummyjson.com/quotes/random
   ============================================================ */

const quoteState = { currentQuote: null, currentAuthor: null };

/**
 * getQuote — Fetches a random motivational quote.
 */
async function getQuote() {
  const statusEl  = document.getElementById('quote-status');
  const btnEl     = document.getElementById('quote-btn');
  const contentEl = document.getElementById('quote-content');
  const nextBtn   = document.getElementById('quote-next-btn');
  const copyBtn   = document.getElementById('quote-copy-btn');

  nextBtn.disabled = true;
  copyBtn.style.display = 'none';
  showLoading(statusEl, btnEl);

  try {
    const data = await fetchJSON('https://dummyjson.com/quotes/random');

    const quote  = data.quote;
    const author = data.author;

    quoteState.currentQuote  = quote;
    quoteState.currentAuthor = author;

    contentEl.innerHTML = `
      <div class="quote-result">
        <span class="quote-mark">\u201c</span>
        <p class="quote-text">${escapeHtml(quote)}</p>
        <div class="quote-divider"></div>
        <p class="quote-author">— ${escapeHtml(author)}</p>
      </div>`;

    nextBtn.style.display = 'inline-flex';
    copyBtn.style.display = 'inline-flex';
    clearStatus(statusEl, btnEl);
    nextBtn.disabled = false;

  } catch {
    contentEl.innerHTML = `<div class="empty-state"><span class="empty-icon">✨</span><p>Click below to get inspired</p></div>`;
    nextBtn.disabled = false;
    showError(statusEl, btnEl, 'Failed to fetch quote. Please try again.');
  }
}

/**
 * copyQuote — Copies "quote — Author" to clipboard.
 */
async function copyQuote() {
  if (!quoteState.currentQuote) return;
  const btn      = document.getElementById('quote-copy-btn');
  const clipText = `"${quoteState.currentQuote}" — ${quoteState.currentAuthor}`;

  try {
    await navigator.clipboard.writeText(clipText);
    const orig = btn.textContent;
    btn.textContent = '✓ Copied!';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 2000);
  } catch {
    alert('Copy failed. Quote:\n' + clipText);
  }
}
