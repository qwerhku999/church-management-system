MinistryFlow — Church Management System API
https://img.shields.io/badge/Node.js-Backend-green https://img.shields.io/badge/Express.js-API-black https://img.shields.io/badge/MongoDB-Database-green https://img.shields.io/badge/Auth-JWT-orange

MinistryFlow is an API‑first, production‑grade backend for church operations. Built with Node.js, Express, and MongoDB, this repository provides secure, extensible REST APIs for managing members, ministries, attendance, events, donations, announcements, visitors, prayer requests, reports, and administrative workflows.

Overview
Purpose  
Provide a single, secure API surface for church administrators, pastors, staff, ministry leaders, volunteers, and finance teams to manage people, programs, and giving.

Design goals

API first and frontend agnostic

Secure by default with role based access control

Modular and extensible architecture for rapid feature development

Consistent JSON responses and centralized error handling

Production readiness with logging, validation, and documentation

Key Features
Authentication and Security

JWT access tokens and refresh tokens with rotation

Role based authorization with fine grained permissions

Password hashing with bcrypt and secure token storage

Helmet, CORS, rate limiting, and input validation

Audit logging for sensitive operations

Core Domain

Members full CRUD, search, filtering, and statistics

Ministries management and leader assignment

Attendance recording for members and visitors with analytics

Events scheduling, RSVPs, and capacity management

Donations and finance records with reporting and exports

Visitors, prayer requests, announcements, documents, and reports

Operational

Centralized error handling and structured logging with Winston

Swagger OpenAPI documentation and Postman collection included

Pagination, filtering, sorting, and server side search on list endpoints

Background jobs for email and exports

Tech Stack and Architecture
Tech Stack

Layer	Technology
Runtime	Node.js
Framework	Express.js
Database	MongoDB Atlas
ODM	Mongoose
Auth	JWT with refresh tokens
Validation	express-validator or Joi
Logging	Winston and Morgan
Security	bcrypt, Helmet, rate-limit, input sanitization


Architecture Principles

Separation of concerns: Routes → Controllers → Services → Models

Middleware driven: authentication, authorization, validation, pagination, error handling

Consistent response envelope for all endpoints:

json
{ "success": true, "message": "Operation successful", "data": {} }
{ "success": false, "message": "Error message", "error": {} }
Extensible modules: each domain area is self contained and testable

Project Structure
Code
backend
│
├── config
│   └── database.js
│
├── controllers
│
├── middleware
│   ├── auth.js
│   ├── authorize.js
│   ├── errorHandler.js
│   └── validate.js
│
├── models
│
├── routes
│
├── services
│
├── validators
│
├── utils
│
├── jobs
│
├── docs
│   ├── openapi.yaml
│   └── postman_collection.json
│
├── tests
│
├── app.js
├── server.js
├── package.json
└── .env
Folder responsibilities

controllers: HTTP handlers and Swagger JSDoc comments

services: business logic and database interactions

models: Mongoose schemas and indexes

validators: request validation and sanitization rules

middleware: auth, RBAC, error handling, pagination, logging

utils: pagination builder, filter parser, email helpers

jobs: background workers and scheduled tasks

Getting Started
Prerequisites

Node.js 18 or later

npm or yarn

MongoDB Atlas account or local MongoDB instance

Git

Environment
Create a .env file in the backend folder with these variables:

env
PORT=5000
MONGO_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/ministryflow"
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=30d
FRONTEND_ORIGIN=http://localhost:5173
NODE_ENV=development
Install and run

bash
# from repository root or backend folder
cd backend
npm install

# development
npm run dev

# production
npm start
Useful npm scripts

json
{
  "dev": "nodemon server.js --watch src --watch config",
  "start": "node server.js",
  "lint": "eslint .",
  "test": "jest --runInBand"
}
API documentation

Swagger UI: GET /api/docs

Postman collection: docs/postman_collection.json (import into Postman)

Authentication flow

Login: POST /api/auth/login returns accessToken and refreshToken

Refresh: POST /api/auth/refresh-token rotates refresh tokens and returns a new access token

Protected routes: require Authorization: Bearer <accessToken> header

Security and Deployment
Security best practices

Hash passwords with bcrypt and use strong salt rounds

Use short lived access tokens and rotate refresh tokens on use

Store refresh tokens hashed in the database and revoke on reuse

Enforce HTTPS in production and restrict CORS to trusted origins

Rate limit authentication endpoints and sanitize inputs

Deployment recommendations

Containerize with Docker and deploy to Kubernetes or a managed platform

Use environment variables or a secrets manager for production secrets

Use MongoDB Atlas for managed backups and high availability

Monitoring

Structured logs with Winston and log rotation

Integrate Sentry for error tracking and a log aggregator for metrics

Add health check endpoints for readiness and liveness probes

Contributing and License
How to contribute

Fork the repository

Create a feature branch

bash
git checkout -b feature/your-feature
Commit changes with clear messages

bash
git commit -m "feat: add feature description"
Push branch and open a pull request

Code standards

Include tests for new features and ensure CI passes

Follow ESLint rules and repository formatting conventions

License
This project is licensed under the MIT License. Add a LICENSE file to the repository.

Author
Nana Kwafo Ammonoh