# Blog API

A simple RESTful backend for a blog application, built with Express.js, MongoDB and JWT-based authentication. Supports CRUD for posts and authors, pagination, validation, and error handling.

---

## Table of Contents

1. [Features](#features)  
2. [Tech Stack](#tech-stack)  
3. [Prerequisites](#prerequisites)  
4. [Project Structure](#project-structure)  
5. [Setup & Installation](#setup--installation)  
6. [Environment Variables](#environment-variables)  
7. [Database](#database)  
8. [Running the Server](#running-the-server)  
9. [Authentication](#authentication)  
10. [API Endpoints](#api-endpoints)  
    - [Auth](#auth)  
    - [Authors](#authors)  
    - [Posts](#posts)  
11. [Validation & Error Handling](#validation--error-handling)  
12. [Pagination](#pagination)  
13. [Further Improvements](#further-improvements)  

---

## Features

- **User Authentication** via JSON Web Tokens (JWT)  
- **CRUD** operations for blog posts  
- **Author** registration & lookup  
- **Pagination** support on posts listing  
- **Input Validation** using `express-validator`  
- **Centralized Error Handling**  
- **Protected Routes**: only authenticated authors can create/update/delete their own posts  

---

## Tech Stack

- **Node.js** & **Express.js**  
- **MongoDB** with **Mongoose** ODM  
- **JWT** for token-based auth  
- **bcrypt.js** for password hashing  
- **dotenv** for environment config  
- **express-validator** for request validation  

---

## Prerequisites

- Node.js v14+  
- MongoDB v4+ (local or Atlas)  
- npm (or yarn)  

---

## Project Structure

```

blog-api/
├── .env
├── package.json
├── server.js
├── config/
│   └── db.js
├── models/
│   ├── Author.js
│   └── Post.js
├── routes/
│   ├── auth.js
│   ├── authors.js
│   └── posts.js
└── middleware/
├── auth.js
└── errorHandler.js

````

---

## Setup & Installation

1. **Clone the repo**  
   ```bash
   git clone https://github.com/ali-amir-code/blog_api_t4.git
   cd blog-api
    ````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create `.env`** (see next)

---

## Environment Variables

Create a `.env` file in the project root with:

```ini
PORT=5000
MONGO_URI=mongodb://localhost:27017/blogdb
JWT_SECRET=your_jwt_secret_here
```

* `PORT` Server port
* `MONGO_URI` MongoDB connection string
* `JWT_SECRET` Secret key for signing JWT tokens

---

## Database

* Default database: `blogdb` on localhost.
* Collections:

  * `authors` (fields: `_id`, `name`, `email`, `password`)
  * `posts`   (fields: `_id`, `title`, `content`, `author` (ref), `createdAt`)

---

## Running the Server

* **Development** (with auto-reload):

  ```bash
  npm run dev
  ```
* **Production**:

  ```bash
  npm start
  ```

Server will be listening on `http://localhost:<PORT>`.

---

## Authentication

All protected routes require an `Authorization` header:

```
Authorization: Bearer <token>
```

* **Register**: `POST /auth/register` → returns `{ token }`
* **Login**:    `POST /auth/login`    → returns `{ token }`

---

## API Endpoints

### Auth

| Method | Endpoint         | Body                                      | Response    |
| ------ | ---------------- | ----------------------------------------- | ----------- |
| POST   | `/auth/register` | `{ name, email, password (min 6 chars) }` | `{ token }` |
| POST   | `/auth/login`    | `{ email, password }`                     | `{ token }` |

### Authors

> Protected: require `Authorization` header.

| Method | Endpoint       | Response                 |
| ------ | -------------- | ------------------------ |
| GET    | `/authors`     | `[{ _id, name, email }]` |
| GET    | `/authors/:id` | `{ _id, name, email }`   |

### Posts

> Public read; protected write/update/delete.

| Method | Endpoint     | Query / Body                                                             | Response                                                  |
| ------ | ------------ | ------------------------------------------------------------------------ | --------------------------------------------------------- |
| GET    | `/posts`     | `?limit=<n>&page=<p>`<br>(both optional, defaults: `limit=10`, `page=1`) | `[{ _id, title, content, author:{_id,name}, createdAt }]` |
| GET    | `/posts/:id` | —                                                                        | `{ _id, title, content, author:{_id,name}, createdAt }`   |
| POST   | `/posts`     | `{ title, content }`                                                     | `201 Created` + newly created post object                 |
| PUT    | `/posts/:id` | `{ title? (optional), content? (optional) }`                             | Updated post object                                       |
| DELETE | `/posts/:id` | —                                                                        | `{ msg: "Post removed" }`                                 |

---

## Validation & Error Handling

* **Missing fields**: returns `400 Bad Request` + array of validation errors
* **Unauthorized**: returns `401 Unauthorized` or `403 Forbidden`
* **Not found**: returns `404 Not Found` for missing posts/authors
* **Server errors**: `500 Internal Server Error` with `{ error }`

All errors funnel through `middleware/errorHandler.js` for consistent JSON responses.

---

## Pagination

* Clients may request page-by-page data via query parameters:

  ```http
  GET /posts?limit=5&page=2
  ```
* Response returns up to `limit` posts, skipping `(page-1)*limit`.

---

## Further Improvements

* **Comments**: add a `Comment` model + nested routes.
* **Tags/Categories**: associate posts with tags.
* **Rate limiting**: protect from brute-force login.
* **Swagger/OpenAPI**: auto-generate docs.
* **Tests**: add Jest/Mocha test suite.
* **Deployment**: Dockerize & deploy to Heroku/Vercel.

---

**Enjoy building your blog!**
Feel free to customize and extend as needed.
