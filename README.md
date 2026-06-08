# THOLA

## Find What You Need. Offer What You Have. Trust Who You Deal With.

THOLA is a fully functional serverless frontend prototype of a peer-to-peer skills and goods exchange marketplace designed to empower South African youth. The platform allows users to explore opportunities to offer skills, services, products, and requests within their local communities.

This project was developed as a modern, high-fidelity frontend web application, focusing on rich aesthetics, consistent responsive design, global dark mode support, and interactive client-side functionality.

---

## Project Objective

The goal of this project was to design and develop the **frontend interface & client-side interactions** of THOLA using modern web standards.

The project demonstrates:
* **Fully Responsive Web Design**: Consistent navigation and layouts across all viewport sizes (desktop down to mobile screens).
* **Unified Aesthetics & Theme Support**: Integrated light/dark mode switcher active across all pages.
* **Serverless Authentication**: Secure registration and password reset via client-side email verification codes (OTPs).
* **Client-side Encryption**: Secure storage of passwords using SHA-256 hashing.
* **Mock Database Persistence**: All listings and user accounts are managed and saved locally in the browser's `localStorage`.

---

## Technologies Used

* **Core**: HTML5, Vanilla CSS3 (curated theme palette), Vanilla JavaScript (ES6+)
* **Authentication & Messaging**: [EmailJS](https://www.emailjs.com/) for sending OTP/Verification codes and Reset codes directly from the browser.
* **Security**: Web Crypto API (SHA-256) for password encryption.

---

## Live Demo

Website: [https://tholagala.netlify.app](https://tholagala.netlify.app)

---

## Pages Developed

| Page | Description |
| ---- | ----------- |
| **Landing Page** | Introduction to the platform, core services preview, stats, and call-to-actions. |
| **Register Page** | Sign-up interface with secure 6-digit OTP verification sent directly to the user's email. |
| **Login Page** | User authentication interface with credentials check and "Forgot Password" link. |
| **Forgot Password** | 3-step secure recovery flow (Email look-up -> OTP code verification -> Hashed password update). |
| **Dashboard** | Main browsing experience, live feed of listings, listing search, and category filters. |
| **Post Listing** | Create and publish a skill, product, job, or request listing (with local file upload/preview). |
| **Listing Detail** | High-fidelity overview of listings, custom pricing, locations, and connection prompts. |
| **Chat Page** | Live mock-messaging and transaction negotiation interface. |
| **Search Page** | Unified keyword search and filter options. |
| **Profile Page** | User profile manager with editable personal details, location, dynamic skills lists, and deal history. |
| **Report Page** | Safe environment to flag/report listings or users. |

---

## Configuration & Environment Setup

This project uses EmailJS to send email verification codes for registration and password resets. These keys are kept secure using environment variables during deployment and configured locally in a configuration file.

### 1. Local Setup
Create a file named `js/credentials.js` in the project root containing your EmailJS keys:
```javascript
const EMAILJS_PUBLIC_KEY = "your_public_key";
const EMAILJS_SERVICE_ID = "your_service_id";
const EMAILJS_TEMPLATE_ID = "your_registration_template_id";
const EMAILJS_RESET_TEMPLATE_ID = "your_password_reset_template_id";
```
*Note: `js/credentials.js` is included in `.gitignore` to prevent committing secret keys to version control.*

### 2. Production Deployment (Netlify)
The project is configured with a build command in `netlify.toml` that automatically generates `js/credentials.js` on build time using Netlify Environment Variables.

Configure the following environment variables in your Netlify panel (**Site configuration > Environment variables**):
* `EMAILJS_PUBLIC_KEY`
* `EMAILJS_SERVICE_ID`
* `EMAILJS_TEMPLATE_ID`
* `EMAILJS_RESET_TEMPLATE_ID`

---

## Team Members

| Team Member | Responsibility |
| ----------- | -------------- |
| **Lebogang** | Dashboard & Listings integration |
| **Thapelo** | Landing Page, Report Page, Global Styling |
| **Lutendo** | Register, Login, & Password Reset Pages |
| **Tsholofelo** | Chat, Search, & Navigation standardization |
| **Arabi** | Post Listing & Listing Detail Pages |

---

## Project Structure

```text
thola-website/
├── html/             # Contains all website sub-pages
├── css/              # Shared stylesheet (style.css)
├── js/               # Main logic files (main.js, credentials.js)
├── netlify.toml      # Config for production build automation
├── index.html        # Landing page
└── README.md         # Documentation
```

---

## Running the Project Locally

1. Clone the repository:
```bash
git clone <repository-link>
```
2. Set up your local `js/credentials.js` configuration file (see instructions above).
3. Open `index.html` in your browser (ideally using a local server extension such as VS Code's Live Server) to start testing.

---

## Project Status

✅ Frontend Prototype Complete (with fully interactive client-side logic).

---

Built for South African youth entrepreneurship and local opportunity creation.
