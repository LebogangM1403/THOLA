# THOLA

## Find What You Need. Offer What You Have. Trust Who You Deal With.

THOLA is a frontend prototype of a peer-to-peer skills and goods exchange platform designed to empower South African youth. The platform allows users to explore opportunities to offer skills, services, products, and requests within their communities.

This project was developed as part of a frontend web development assignment, focusing on user experience, interface design, responsiveness, and client-side functionality.

---

## Project Objective

The goal of this project was to design and develop the **frontend interface** of THOLA using HTML, CSS, and JavaScript.

The project demonstrates:

* Responsive web design
* User-friendly navigation
* Form validation
* Client-side data handling
* Interactive user interfaces
* Modern web development practices
* Dark / Light mode customization

---

## Technologies Used

* HTML5
* CSS3 (Modular Stylesheets)
* JavaScript (Vanilla JS)
* EmailJS (for OTP verification and password reset emails)
* Web Crypto API (SHA-256 password hashing)
* Inline SVG Icons (for scalable and theme-friendly social indicators)

---

## Live Demo

Website: https://tholagala.netlify.app

---

## Pages Developed

| Page            | Description                                                                       |
| --------------- | --------------------------------------------------------------------------------- |
| Landing Page    | Introduction to the platform (`index.html`)                                       |
| Learn More      | Public overview of THOLA features and how it works (`learn-more.html`)            |
| Register Page   | User registration with 6-digit OTP email verification (`register.html`)          |
| Create Account  | Alternative account creation flow (`create_user.html`)                           |
| Login Page      | User authentication interface (`login.html`)                                      |
| Forgot Password | 3-step password recovery: email lookup, OTP verification, new password (`forgot-password.html`) |
| Dashboard       | Main browsing experience with search and filters (`dashboard.html`)              |
| Post Listing    | Create a skill, product, job, or request listing (`post-listing.html`)           |
| Listing Detail  | View full listing information and contact seller (`listing-detail.html`)         |
| Chat Page       | Messaging and negotiation interface (`chat.html`)                                |
| Search Page     | Search and filtering functionality (`search.html`)                               |
| Profile Page    | User profile management and listing history (`profile.html`)                     |
| Report Page     | Report listings or users for moderation (`report.html`)                          |

---

## Configuration

This project uses EmailJS to send OTP codes for registration and password resets. You need to configure your own EmailJS keys.

Create a file `js/credentials.js` with the following content:

```javascript
const EMAILJS_PUBLIC_KEY = "your_public_key";
const EMAILJS_SERVICE_ID = "your_service_id";
const EMAILJS_TEMPLATE_ID = "your_registration_template_id";
const EMAILJS_RESET_TEMPLATE_ID = "your_password_reset_template_id";
```

> Note: `js/credentials.js` should be kept out of version control if your repository is public.

---

## Team Members

| Team Member | Responsibility                            |
| ----------- | ----------------------------------------- |
| Lebogang    | Dashboard                                 |
| Thapelo     | Landing Page, Report Page, Global Styling |
| Lutendo     | Register, Login, and Forgot Password Pages |
| Tsholofelo  | Chat and Search Pages                     |
| Arabi       | Post Listing and Listing Detail Pages     |

---

## Project Structure

```text
THOLA/
├── html/
│   ├── index.html              # Landing page
│   ├── learn-more.html         # Public platform overview (no login required)
│   ├── register.html           # OTP-based user registration
│   ├── create_user.html        # Alternative account creation
│   ├── login.html              # User login
│   ├── forgot-password.html    # 3-step password recovery
│   ├── dashboard.html          # Main listings dashboard
│   ├── post-listing.html       # Create a new listing
│   ├── listing-detail.html     # View a single listing
│   ├── chat.html               # Messaging & offer negotiation
│   ├── search.html             # Search & filter listings
│   ├── profile.html            # User profile management
│   └── report.html             # Report a listing or user
│
├── css/
│   ├── global.css              # Reset rules and typography system variables
│   ├── index.css               # Landing page custom styles
│   ├── learn-more.css          # Safety platform overview custom styles
│   ├── auth.css                # Authentication suite custom styles
│   ├── dashboard.css           # Listings hub custom styles
│   ├── post-listing.css        # New listing creation custom styles
│   ├── listing-detail.css      # Individual listing details custom styles
│   ├── chat.css                # Thread chatting system custom styles
│   ├── search.css              # Custom styling for advanced searches
│   ├── profile.css             # Profile views, badges & ratings custom styles
│   ├── report.css              # Flag reporting forms custom styles
│   └── style.css               # Legacy root custom styles
│
├── js/
│   ├── main.js                 # Global logic: auth guard, theme, navbar
│   ├── credentials.js          # EmailJS keys (excluded from version control)
│   ├── chat.js                 # Chat page logic
│   ├── create_user.js          # Account creation logic
│   ├── dashboard.js            # Dashboard filter & listing logic
│   ├── forgot-password.js      # Password reset flow logic
│   ├── listing-detail.js       # Listing detail page logic
│   ├── login.js                # Login authentication logic
│   ├── post-listing.js         # Post listing form logic
│   ├── profile.js              # Profile management logic
│   ├── register.js             # Registration & OTP logic
│   ├── report.js               # Report submission logic
│   └── search.js               # Search & filter logic
│
├── THOLA_Daily_User_Manual.pdf # Non-technical Daily User Guide PDF
├── THOLA_Platform_Guide.pdf    # Developer & User System Technical Guide PDF
└── README.md
```

---

## Running the Project

1. Clone the repository.

```bash
git clone <repository-link>
```

2. Open the project folder.

3. Add your EmailJS credentials to `js/credentials.js` (see Configuration above).

4. Launch `index.html` in your browser or use Live Server.

No installation or backend setup is required.

---

## Project Status

✅ Frontend Development Complete

The project successfully delivers the required frontend pages, styling, navigation, and client-side interactions as specified in the project requirements.

---

## Note

This project focuses on frontend development only. Backend services, databases, payment systems, and production deployment features are outside the scope of this implementation.

---

Built for South African youth entrepreneurship and opportunity creation.
