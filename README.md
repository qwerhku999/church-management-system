# MinistryFlow — Church Management System

MinistryFlow is a modern Church Management System designed to help churches manage their daily operations through a centralized digital platform.

The system provides tools for managing members, ministries, attendance, events, donations, announcements, visitors, and administrative activities. It is built with a scalable architecture separating the frontend application from a secure backend API.

MinistryFlow aims to simplify church administration, improve record keeping, and provide church leaders with better insights into their community.

## Project Overview

MinistryFlow is built as a full-stack application consisting of:

* Frontend: A modern web application built with Next.js and TypeScript.
* Backend: A RESTful API built with Node.js, Express.js, and MongoDB.

The system follows a modular architecture to allow future expansion into a complete church management SaaS platform.

## Key Features

### Member Management

* Create, update, and manage church member profiles.
* Track membership status and membership types.
* Store member contact information and personal details.
* Search and filter members.
* Generate unique member identification numbers.

### Ministry Management

* Create and manage different church ministries.
* Assign ministry leaders and co-leaders.
* Add members to ministries.
* Track ministry categories and activities.

### Attendance Management

* Record attendance for church services and events.
* Track members, visitors, and attendance trends.
* Generate attendance statistics.

### Event Management

* Create and manage church events.
* Track event details and schedules.
* Manage event participation.

### Finance and Donations

* Record donations and financial transactions.
* Track church financial activities.
* Generate reports for administrative review.

### Communication and Administration

* Manage announcements.
* Handle visitor records.
* Manage prayer requests.
* Store important church documents.
* Maintain administrative records.

## Technology Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Modern component-based architecture

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose ODM
* JWT Authentication
* bcrypt Password Hashing
* Express Validator
* Helmet Security Middleware
* CORS
* Morgan Logging

## Database

MinistryFlow uses MongoDB with Mongoose for database management.

The database stores:

* Users
* Members
* Ministries
* Attendance records
* Events
* Donations
* Announcements
* Visitors
* Documents
* Prayer requests

## Project Structure

ministryflow/

backend/

* API server
* Database models
* Controllers
* Routes
* Authentication
* Business logic
* Security middleware

frontend/

* User interface
* Dashboard pages
* Client-side components
* Frontend application logic

## Backend Architecture

The backend follows a structured architecture:

Routes → Controllers → Services → Models

This approach improves:

* Maintainability
* Scalability
* Code organization
* Future feature development

## Security Features

The system includes:

* JWT-based authentication
* Role-based access control
* Password encryption using bcrypt
* Secure HTTP headers using Helmet
* Input validation
* Error handling middleware
* Protected API routes

## Getting Started

## Prerequisites

Before running MinistryFlow, ensure you have:

* Node.js installed
* npm installed
* MongoDB Atlas account or local MongoDB installation
* Git installed

## Installation

Clone the repository:

git clone [https://github.com/qwerhku999/church-management-system.git](https://github.com/qwerhku999/church-management-system.git)

Navigate into the project:

cd ministryflow

## Backend Setup

Navigate to the backend folder:

cd backend

Install dependencies:

npm install

Create a .env file inside the backend folder:

PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

Start the backend server:

npm run dev

The backend API will run on:

[http://localhost:5000](http://localhost:5000)

## Frontend Setup

Navigate to the frontend folder:

cd frontend

Install dependencies:

npm install

Start the frontend application:

npm run dev

The frontend application will run on:

[http://localhost:3000](http://localhost:3000)

## API Development

The backend provides REST API endpoints for:

* Authentication
* Users
* Members
* Ministries
* Attendance
* Events
* Donations
* Announcements
* Visitors
* Reports

API documentation and testing tools will be added as development continues.

## Current Development Status

MinistryFlow is currently under active development.

Completed:

* Backend project structure
* MongoDB database connection
* User authentication foundation
* Member management module
* Ministry management module
* Attendance module foundation
* Event and finance module foundations
* API architecture setup

In Progress:

* Frontend dashboard development
* Complete authentication flow
* Advanced reporting
* Role-based permissions
* API documentation
* Automated testing

## Future Improvements

Planned improvements include:

* Complete admin dashboard
* Mobile application support
* Real-time notifications
* Email and SMS communication
* Advanced analytics dashboard
* Automated backups
* Cloud deployment
* Multi-church support

## Contribution

Contributions are welcome.

To contribute:

1. Create a feature branch.
2. Make your changes.
3. Test your changes.
4. Submit a pull request.

## License

This project is currently under development.

License information will be added after the project reaches a stable release.

## Author

Developed by Nana Kwafo Isaiah Ammonoh

GitHub:
[https://github.com/qwerhku999](https://github.com/qwerhku999)

---

This version matches your current project structure (`frontend + backend`) and does not pretend features are finished when they are not. It will look professional on GitHub while still being honest about the development stage.
