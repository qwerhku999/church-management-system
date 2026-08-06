# MinistryFlow — Church Management System

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwind-css)
![Node.js](https://img.shields.io/badge/Node.js-18-green?logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-4-lightgrey?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-Auth-orange?logo=jsonwebtokens)
![License](https://img.shields.io/badge/License-Active--Development-yellow)

**MinistryFlow** is a modern Church Management System designed to help churches manage their daily operations through a centralized digital platform.

The system provides comprehensive tools for managing **members**, **ministries**, **attendance**, **events**, **donations**, **finances**, **announcements**, **visitors**, **prayer requests**, **documents**, and **administrative activities**.

Built with a scalable full-stack architecture, MinistryFlow separates the frontend application from a secure backend API, allowing future expansion into a complete church management SaaS platform.

The primary goal of MinistryFlow is to **simplify church administration**, **improve record keeping**, **reduce manual processes**, and **provide church leaders with meaningful insights** into their community.

---

## 🚀 Project Overview

MinistryFlow is a full-stack web application consisting of:

### 🎨 Frontend
A modern dashboard application built with:
* **Framework & Languages:** Next.js 16, React 19, TypeScript
* **Styling:** Tailwind CSS
* **Data Visualization:** Recharts
* **Icons:** Lucide React Icons
* **Architecture:** Modern component-based architecture

**Key Features:**
* Admin dashboard interface
* Data visualization and charts
* Dynamic management pages
* Fully responsive layouts
* Reusable UI components

### ⚙️ Backend
A RESTful API built with:
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database & ODM:** MongoDB Atlas, Mongoose
* **Authentication & Security:** JWT, bcrypt, Helmet, Express Validator, CORS
* **Logging:** Morgan

**Capabilities:**
* Authentication & authorization
* Core business logic
* Database operations & models
* API communication endpoints
* Security middleware

---

## ✨ Key Features

### 🔐 Authentication & Users
* **User registration** and **authentication**
* **JWT-based** authentication
* **Password hashing** with `bcrypt`
* **Protected API routes**
* **Role-based access control** foundation
* Comprehensive **user management**

### 👥 Member Management
* **Create, update, and delete** members
* Track **membership status** and **types**
* Store **personal contact information** and details
* **Search and filter** members
* Generate **unique member numbers**
* Maintain organized **member records**

### 🏛️ Ministry Management
* **Create and manage** church ministries
* Assign **ministry leaders** and **co-leaders**
* Add **members** to specific ministries
* Track **ministry categories** and **activities**

### 📊 Attendance Management
* Record **service** and **event** attendance
* Track **member** and **visitor** attendance
* Monitor **attendance trends** over time
* Generate **detailed attendance statistics**

### 📅 Event Management
* **Create and update** church events
* Store **event details, schedules**, and **locations**
* Manage **event participation** and **RSVPs**

### 💰 Finance & Donations
* Record **donations** and **financial transactions**
* Track overall **church financial activities**
* Maintain **historical finance records**
* Generate **financial reports** for administrative review

### 📢 Communication & Administration
* **Announcements** management
* **Visitor records** management
* **Prayer requests** tracking
* Secure **document storage & management**
* **Real-time notification system**
* **Administrative audit records**

### 📈 Dashboard & Analytics
* **Overview statistics** and **metrics**
* Interactive **attendance analytics**
* **Donation & financial analytics**
* **Recent member activity feeds**
* Data visualization components powered by **Recharts**

---

## 🛠️ Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS, Recharts, Lucide React Icons |
| **Backend** | Node.js, Express.js, JWT, bcrypt, Express Validator, Helmet, CORS, Morgan |
| **Database** | MongoDB Atlas, Mongoose ODM |

---

## 🗄️ Database Schema / Collections

MinistryFlow utilizes **MongoDB** with **Mongoose ODM** to store:

* `Users`
* `Members`
* `Ministries`
* `Attendance`
* `Events`
* `Donations`
* `Finance Records`
* `Announcements`
* `Visitors`
* `Prayer Requests`
* `Documents`
* `Notifications`

---

## 📁 Project Structure

```text
ministryflow/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── app/
    │   ├── components/
    │   ├── context/
    │   ├── hooks/
    │   ├── services/
    │   ├── lib/
    │   └── styles/
    └── package.json

```

### Backend Architecture

$$\text{Routes} \longrightarrow \text{Controllers} \longrightarrow \text{Services} \longrightarrow \text{Models} \longrightarrow \text{Database}$$

---

## 🏁 Getting Started

### Prerequisites

* **Node.js** (v18 or higher recommended)
* **npm**
* **Git**
* **MongoDB Atlas** account or local MongoDB instance

---

### Installation

1. **Clone the repository:**
```bash
git clone [https://github.com/qwerhku999/church-management-system.git](https://github.com/qwerhku999/church-management-system.git)
cd ministryflow

```


2. **Backend Setup:**
```bash
cd backend
npm install

```


Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

```


Start the backend development server:
```bash
npm run dev

```


*Backend API runs at:* `http://localhost:5000`
3. **Frontend Setup:**
```bash
cd ../frontend
npm install
npm run dev

```


*Frontend application runs at:* `http://localhost:3000`

---

## 📌 Current Development Status

### ✅ Completed Features

#### Backend

* Express server setup & API architecture
* MongoDB integration via Mongoose
* User authentication system (`JWT` + `bcrypt`)
* Security middleware (`Helmet`, `CORS`, `Validator`)
* **Modules:** User, Member, Ministry, Attendance, Event, Donation, Finance, Visitor, Prayer Request, Announcement, Notification, Dashboard API

#### Frontend

* Next.js 16 setup with Tailwind CSS
* Dashboard layout (Sidebar, Navbar)
* Reusable UI components & cards
* Data visualization (Attendance chart, Donation chart)
* Recent members display component
* Frontend service structure

---

### 🚧 In Progress

* Complete remaining frontend feature pages
* Complete UI authentication flow integration
* Full API integration across all views
* Advanced analytics dashboard
* Role-based view switching
* UI/UX refinements

---

## 🔮 Future Improvements

* Mobile application support
* Real-time notifications via WebSockets
* Email and SMS communication system
* Advanced AI-powered church analytics & insights
* Automated database backups
* Production cloud deployment
* Multi-church tenant support (SaaS model)

---

## 🤝 Contribution

Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

---

## 📄 License

This project is currently under active development. License information will be updated upon the initial stable release.

---

## 👤 Author

**Nana Kwafo Isaiah Ammonoh**

* GitHub: [@qwerhku999](https://github.com/qwerhku999)
