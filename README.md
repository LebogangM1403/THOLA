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

---

## Technologies Used

* HTML5
* CSS3
* JavaScript (Vanilla JS)
* EmailJS (for OTP verification and password reset emails)
* Web Crypto API (SHA-256 password hashing)

---

## Live Demo

Website: https://tholagala.netlify.app

---

## Pages Developed

| Page           | Description                                      |
| -------------- | ------------------------------------------------ |
| Landing Page   | Introduction to the platform                     |
| Register Page  | User registration with 6-digit OTP email verification |
| Login Page     | User authentication interface                    |
| Forgot Password | 3-step password recovery: email lookup, OTP verification, new password |
| Dashboard      | Main browsing experience                         |
| Post Listing   | Create a skill, product, job, or request listing |
| Listing Detail | View listing information                         |
| Chat Page      | Messaging and negotiation interface              |
| Search Page    | Search and filtering functionality               |
| Profile Page   | User profile management                          |
| Report Page    | Report listings or users                         |

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
thola-website/
├── html/
├── css/
├── js/
├── images/
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
