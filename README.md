# 🚗 Automotive Service Frontend

Frontend for the **Automotive Service App** .  
Built with **React, Vite, TailwindCSS, DaisyUI**, and **React Router v6**.

---

## 📦 Tech Stack
- **React + Vite** – fast build tool & framework  
- **TailwindCSS + DaisyUI** – styling & UI components  
- **React Router v6** – routing system  

---

## 🔐 Auth Flow
- `PrivateRoute` protects logged-in user pages.  
- `AdminRoutes` protects admin-only pages.  

---

## 🚀 Getting Started

```sh
npm install
npm run dev

---

## 📂 Project Structure
src/
├── components/ # Reusable UI components (Header, Footer, etc.)
├── layouts/ # Public, Private, and Admin layouts
├── pages/ # Landing, Signup, Login, Dashboard, etc.
├── routes/ # Route definitions (AppRoutes, PrivateRoute, AdminRoutes)
├── utils/ # Helper functions (API calls, token utils, etc.)
├── App.jsx # Main App entry
└── main.jsx # React DOM render

---
