# Campus Marketplace API

A backend REST API for a campus marketplace where students can create, browse, update, and manage marketplace listings.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- HTTP-only Cookies

## Features

- User registration and login
- JWT authentication
- Role-based access control
- User listing CRUD
- Mark listing as sold
- Search and filter listings
- Admin listing moderation
- Centralized error handling
- Request validation

## Roles

### USER
- Create listings
- View active listings
- Update own listings
- Delete own listings
- Mark own listings as sold

### ADMIN
- View all listings
- Remove any listing
- Manage listing moderation

## Run Locally

```bash
npm install
npm run dev