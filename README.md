# 🏥 Hospital Management App

A complete hospital management system built for an actual hospital usage with **Next.js**, **Tailwind CSS**, **Prisma**, and **Clerk** for secure role-based authentication. This system provides essential hospital features including patient registration, room management, pharmacy billing, and more, designed for Admin, Staff, and Pharma roles.

## 🌐 Live Demo

👉 [Launch Application](https://hospital-software-nine.vercel.app)

---

## 📌 Table of Contents

- [Features](#-features)
- [Roles & Login](#-roles--login)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## ✅ Features

- 🔐 **Clerk Authentication** – Secure, modern user authentication and management.
- 🧑‍⚕️ **Role-Based Access** – Separate functionalities for Admin, Staff, and Pharma.
- 👨‍💼 **Admin Dashboard** – Manage users, patients, rooms, bills, and medicines.
- 🏥 **Patient Management** – Add, view, update, and discharge OPD/inpatient records.
- 🚪 **Room Allocation** – Manage room availability and allocations.
- 💵 **Billing System** – Track admission fees, total charges, payments, and balance.
- 💊 **Pharmacy Module** – Medicine inventory, vendor management, and pharma billing.
- 📊 **Dashboard Insights** – Visual data on admissions, earnings, and expenses.
- 💅 **Responsive UI** – Modern, mobile-friendly UI using Tailwind CSS.

---

## 🔐 Roles & Login

> Use the following test credentials to login as different roles:

| Role     | Username | Password |
|----------|----------|----------|
| Admin    | `admin`  | `admin`  |
| Pharma   | `pharma` | `pharma` |
| Staff    | `staff`  | `staff`  |

Admins can create and manage new users and assign them roles via the admin panel.

---

## 🛠 Tech Stack

- **Frontend**: Next.js (App Router), React
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: Clerk.dev
- **Deployment**: Vercel

---

## 📂 Project Structure


```
.
├── app/              # App router pages and layout
├── components/       # Reusable components
├── lib/              # Utility functions and helpers
├── prisma/           # Prisma schema and migrations
├── public/           # Static files
├── styles/           # Tailwind and global styles
├── .env              # Environment variables
└── next.config.js    # Next.js config

```

## 📸 Screenshots

### 🧑‍💼 Admin Dashboard
![Admin Dashboard](https://github.com/manojk765/HospitalManagementApp/assets/your-image-path/admin-dashboard.png)

### ➕ Add Patient Page
![Add Patient](https://github.com/manojk765/HospitalManagementApp/assets/your-image-path/add-patient.png)

### 💊 Pharma Billing Page
![Pharma Billing](https://github.com/manojk765/HospitalManagementApp/assets/your-image-path/pharma-billing.png)

## 📦 Features

- ✅ Role-based login (Admin, Pharma, Staff)
- ✅ Secure authentication with Clerk
- ✅ Add/search patients
- ✅ Admit/discharge tracking
- ✅ Billing system (Pharma and Admission)
- ✅ Expense and revenue tracking
- ✅ User management (Admins can add/remove users)
- ✅ Medicine and vendor management
- ✅ Built with modular and scalable architecture

## 👨‍💻 Author

**Koneti Manoj**  
📧 Email: manojkoneti05@gmail.com  
🔗 GitHub: [@manojk765](https://github.com/manojk765)
