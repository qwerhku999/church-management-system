Copy this directly into:

`ministryflow/backend/README.md`

No cleanup needed.

# MinistryFlow Backend API

The backend API for MinistryFlow — a modern Church Management System designed to provide secure, scalable, and organized management of church operations.

This backend handles authentication, member management, ministries, attendance tracking, events, donations, announcements, visitors, documents, and administrative workflows.

Built with Node.js, Express.js, and MongoDB, the API follows a modular architecture designed for maintainability, scalability, and future expansion.

# Overview

The MinistryFlow backend provides a centralized REST API that allows the frontend application to communicate securely with the database.

The system is designed for:

* Church administrators
* Pastors
* Staff members
* Ministry leaders
* Volunteers

The main goal is to replace manual church record management with a reliable digital platform.

# Features

## Authentication and Security

* User registration and login
* JWT-based authentication
* Protected API routes
* Password hashing using bcrypt
* Role-based authorization
* Secure HTTP headers with Helmet
* CORS configuration
* Request logging
* Input validation
* Error handling middleware

## User Management

* Create and manage system users
* Assign user roles
* Control access permissions
* Link users with member profiles

Supported roles:

* Super Admin
* Admin
* Pastor
* Staff
* Volunteer
* Member

## Member Management

The member module provides complete management of church members.

Features:

* Create members
* Update member information
* View member profiles
* Search members
* Filter members
* Track membership status
* Generate unique member numbers
* Assign members to ministries

Example member information:

* Name
* Phone number
* Gender
* Address
* Membership type
* Membership status
* Registration date

## Ministry Management

The ministry module manages church departments and groups.

Features:

* Create ministries
* Update ministries
* Assign leaders
* Add members to ministries
* Remove members
* Track ministry information

Examples:

* Youth Ministry
* Music Ministry
* Men's Ministry
* Women's Ministry
* Children's Ministry

## Attendance Management

The attendance module tracks church participation.

Features:

* Record attendance
* Track service attendance
* Record visitor attendance
* View attendance history
* Generate attendance statistics

## Event Management

The event module manages church activities.

Features:

* Create events
* Update events
* Manage event schedules
* Track participation
* Store event details

Examples:

* Sunday Services
* Conferences
* Seminars
* Outreach Programs

## Finance and Donations

The finance module manages church financial records.

Features:

* Record donations
* Track financial transactions
* Maintain donation history
* Generate financial reports

## Additional Modules

The backend also includes support for:

* Visitors
* Announcements
* Prayer requests
* Documents
* Notifications
* Reports
* Audit logs

# Technology Stack

## Runtime

Node.js

## Framework

Express.js

## Database

MongoDB Atlas

## ODM

Mongoose

## Authentication

JWT (JSON Web Token)

## Security

* bcrypt
* Helmet
* CORS
* Express Validator

## Development Tools

* npm
* Nodemon
* Git
* Postman

# Backend Architecture

The backend follows a modular MVC-based architecture.

Structure:

Routes → Controllers → Services → Models

## Routes

Responsible for defining API endpoints and connecting requests to controllers.

Location:

routes/

## Controllers

Responsible for handling HTTP requests and responses.

Location:

controllers/

## Services

Contains business logic and reusable operations.

Location:

services/

## Models

Contains MongoDB database schemas.

Location:

models/

## Middleware

Handles:

* Authentication
* Authorization
* Validation
* Error handling
* File uploads
* Logging

Location:

middleware/

## Validators

Handles request validation rules.

Location:

validators/

## Utils

Contains reusable helper functions.

Location:

utils/

# Project Structure

backend/

config/

* Database configuration
* Application configuration

controllers/

* Request handlers

middleware/

* Authentication and security middleware

models/

* MongoDB schemas

routes/

* API route definitions

services/

* Business logic

utils/

* Helper functions

validators/

* Request validation

app.js

* Express application configuration

server.js

* Server startup file

# Installation

## Prerequisites

Install:

* Node.js 18+
* npm
* MongoDB Atlas account
* Git

# Setup

Navigate into the backend folder:

cd backend

Install dependencies:

npm install

Create a .env file:

PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

# Running the Server

Development mode:

npm run dev

Production mode:

npm start

The API will run at:

[http://localhost:5000](http://localhost:5000)

# API Response Format

All API responses follow a consistent JSON structure.

Successful response:

{
"success": true,
"message": "Operation successful",
"data": {}
}

Error response:

{
"success": false,
"message": "Error message"
}

# API Modules

Available API routes:

Authentication:

/api/auth

Members:

/api/members

Ministries:

/api/ministries

Attendance:

/api/attendance

Events:

/api/events

Donations:

/api/donations

Announcements:

/api/announcements

Visitors:

/api/visitors

Documents:

/api/documents

Reports:

/api/reports

# Testing

API testing can be performed using:

* Postman
* Swagger documentation
* Frontend integration testing

Testing coverage will be expanded as development continues.

# Environment Variables

Required environment variables:

PORT

Defines the server port.

MONGODB_URI

MongoDB database connection string.

JWT_SECRET

Secret key used for authentication tokens.

# Development Status

Current backend progress:

Completed:

* Express server setup
* MongoDB connection
* Database models
* Authentication foundation
* Member API
* Ministry API foundation
* Attendance API foundation
* Middleware structure
* Project architecture

In Progress:

* Complete route implementation
* Advanced permissions
* API documentation
* Automated testing
* Production deployment configuration

# Future Improvements

Planned backend improvements:

* Swagger API documentation
* Refresh token system
* Email notification service
* Background jobs
* Advanced reporting system
* Cloud storage integration
* Automated database backups
* CI/CD pipeline

# Author

Developed by Nana Kwafo Isaiah Ammonoh

GitHub:
[https://github.com/qwerhku999](https://github.com/qwerhku999)

---
