# ⚡️ Public API Playground

A simple, fast, and elegant web dashboard demonstrating asynchronous JavaScript, DOM manipulation, and modern responsive UI design by integrating live data from four distinct public APIs.

![Preview](https://img.shields.io/badge/Status-Complete-success?style=for-the-badge) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)

## 🌟 Features

The playground consists of four interactive cards, each demonstrating a different API integration with robust error handling and loading states:

- **🐕 Dog Finder:** Fetches random dog images and dynamically extracts the breed name. (Powered by [Dog CEO API](https://dog.ceo/dog-api/))
- **😂 Joke Generator:** Fetches random programming and general jokes, displaying setups and punchlines. (Powered by [Official Joke API](https://github.com/15Dkatz/official_joke_api))
- **👤 Random User:** Generates full user profiles including avatars, emails, locations, formatting ages, and phone numbers. (Powered by [RandomUser API](https://randomuser.me/))
- **✨ Motivation Generator:** Delivers inspiring quotes along with the author's name, featuring a convenient "Copy to Clipboard" functionality. (Powered by [DummyJSON Quotes API](https://dummyjson.com/docs/quotes))

## 🛠 Tech Stack & Highlights

- **Pure Vanilla Stack:** Built entirely with raw HTML5, CSS3, and ES6+ JavaScript. No frameworks or heavy libraries.
- **Modern UI/UX:** A sleek, Vercel/Stripe-inspired interface using CSS Grid, Flexbox, soft shadows, and clean typography (Inter font).
- **Dark & Light Mode:** Seamlessly switch between themes. Preferences are saved automatically via `localStorage`.
- **Responsive Layout:** Adaptive card grids tailored for Desktop, Tablet, and Mobile views.
- **Robust Architecture:** All API interactions use modern `async / await` and the `fetch` API, wrapped in reusable utility functions guarding against XSS.
- **Layout Integrity:** Strictly designed with `min-height` over rigid height locks, ensuring zero overflowing or broken scrolling edge cases.

## 🚀 How to Run Locally

Since this project requires no build tools or bundlers, it runs out of the box!

1. Clone the repository:
   ```bash
   git clone https://github.com/harshhh-08/API-Playground.git
   ```
2. Navigate into the folder:
   ```bash
   cd API-Playground
   ```
3. Open `index.html` in your favorite web browser.

**Enjoy exploring the APIs!**
