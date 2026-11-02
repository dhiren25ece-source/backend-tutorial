# Backend Web Development Tutorial: Node.js, Express & MongoDB

> Implementation of the complete beginner backend development tutorial: [Intro to Backend Web Development – Node.js, Express, MongoDB (freeCodeCamp)](https://www.youtube.com/watch?v=KOutPbKc9UM) by Shivani.

This repository contains a full RESTful backend built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)** following the **Model-Route-Controller (MRC)** architectural pattern, along with authentication (bcrypt password hashing), full **CRUD operations**, and an importable **Postman Collection**.

---

## 📋 Table of Contents
1. [Tech Stack & Architecture](#-tech-stack--architecture)
2. [Project Structure](#-project-structure)
3. [Step a: Node Project Setup & Git Instructions](#-step-a-node-project-setup--git-instructions)
4. [Step b: Setup Online MongoDB Account & Cluster](#-step-b-setup-online-mongodb-account--cluster)
5. [Step c: MongoDB Database Models](#-step-c-mongodb-database-models)
6. [Step d: Express APIs (Routes & Controllers)](#-step-d-express-apis-routes--controllers)
7. [Step e: Testing with Postman Desktop App](#-step-e-testing-with-postman-desktop-app)
8. [Assignment Submission: Pushing to GitHub](#-assignment-submission-pushing-to-github)

---

## 🛠 Tech Stack & Architecture

- **Runtime Environment:** [Node.js](https://nodejs.org/) (ES Modules)
- **Web Framework:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Cloud NoSQL)
- **ODM (Object Data Modeling):** [Mongoose](https://mongoosejs.com/)
- **Security & Utilities:** `bcryptjs` (password hashing), `dotenv` (environment variables), `cors`
- **Development Tooling:** `nodemon` (hot reloading)
- **API Testing:** [Postman](https://www.postman.com/downloads/)

### Model-Route-Controller (MRC) Pattern
```
Client (Postman / Browser)
         │  HTTP Request
         ▼
    src/index.js (Express Server & Middleware)
         │
         ▼
    src/routes/ (Route Matching & HTTP Verb Mapping)
         │
         ▼
  src/controllers/ (Business Logic, Validation & Responses)
         │
         ▼
    src/models/ (Mongoose Schema & MongoDB ODM)
         │
         ▼
   MongoDB Atlas (Cloud Database)
```

---

## 📂 Project Structure

```text
backend-tutorial/
├── .env                       # Local environment variables (ignored by Git)
├── .env.example               # Template for environment variables
├── .gitignore                 # Files excluded from version control
├── package.json               # Node.js dependencies and scripts
├── package-lock.json          # Locked dependency tree
├── postman_collection.json    # Importable Postman Collection with all requests
├── README.md                  # Complete documentation and setup guide
└── src/
    ├── config/
    │   └── db.js              # MongoDB Atlas connection handler
    ├── controllers/
    │   ├── user.controller.js # Logic for Register, Login, Read, and Delete users
    │   └── post.controller.js # Logic for CRUD operations on Posts
    ├── models/
    │   ├── user.model.js      # Mongoose User schema & model
    │   └── post.model.js      # Mongoose Post schema & model (ref: User)
    ├── routes/
    │   ├── user.routes.js     # User endpoints router (/api/users)
    │   └── post.routes.js     # Post CRUD endpoints router (/api/posts)
    └── index.js               # Application entry point & server bootstrap
```

---

## 🚀 Step a: Node Project Setup & Git Instructions

### 1. Prerequisites
- **Node.js** (v18+ or v20+ recommended)
- **Git** installed on your system

### 2. Installation
Open your terminal in the project directory and run:

```bash
# Install all required dependencies
npm install
```

### 3. Scripts
- **Start Production Server:**
  ```bash
  npm start
  ```
- **Start Development Server (with auto-reload via nodemon):**
  ```bash
  npm run dev
  ```

---

## ☁️ Step b: Setup Online MongoDB Account & Cluster

Follow these steps to set up your free cloud MongoDB database on MongoDB Atlas:

1. **Sign Up / Log In:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   - Sign up for a free account (or log in with Google / GitHub).

2. **Create a Free Cluster:**
   - Click **Create Database** / **Build a Database**.
   - Select the **M0 Free** shared tier.
   - Choose a cloud provider (e.g., AWS) and region closest to you (e.g., `us-east-1` or `ap-south-1`).
   - Cluster Name: Keep as default (`Cluster0`) or name it `backend-tutorial`.
   - Click **Create Deployment**.

3. **Configure Database User:**
   - Go to **Security > Database Access** (left sidebar).
   - Click **Add New Database User**.
   - Authentication Method: **Password**.
   - Username: `admin` (or your choice).
   - Password: Choose an alphanumeric password (e.g., `MyPassword123!`). *Save this password!*
   - Built-in Role: **Read and write to any database**.
   - Click **Add User**.

4. **Configure Network Access (IP Whitelist):**
   - Go to **Security > Network Access** (left sidebar).
   - Click **Add IP Address**.
   - Click **Allow Access from Anywhere** (adds `0.0.0.0/0`).
   - Click **Confirm** (takes ~1 minute to activate).

5. **Copy the Connection String:**
   - Go to **Database > Clusters** and click **Connect**.
   - Choose **Drivers** (Node.js).
   - Copy the URI string, which looks like:
     ```text
     mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
     ```

6. **Add to `.env`:**
   - Create a `.env` file in the project root:
     ```env
     PORT=5000
     NODE_ENV=development
     MONGODB_URI=mongodb+srv://admin:MyPassword123!@cluster0.abcde.mongodb.net/backendTutorialDB?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password and specify a database name (e.g., `backendTutorialDB`).

---

## 🗄️ Step c: MongoDB Database Models

### 1. User Model (`src/models/user.model.js`)
Defines the schema for application users:
- `username`: String, required, unique, trimmed, minlength 3
- `email`: String, required, unique, lowercase, regex-validated
- `password`: String, required (stored as a salted bcrypt hash)
- `timestamps`: Automatically adds `createdAt` and `updatedAt`

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
    email:    { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
```

### 2. Post Model (`src/models/post.model.js`)
Defines the schema for posts and references the author `User`:
- `title`: String, required, trimmed, maxlength 100
- `content`: String, required
- `author`: `mongoose.Schema.Types.ObjectId`, references `'User'`, required
- `timestamps`: Automatically adds `createdAt` and `updatedAt`

```javascript
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title:   { type: String, required: true, trim: true, maxlength: 100 },
    content: { type: String, required: true },
    author:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Post', postSchema);
```

---

## ⚡ Step d: Express APIs (Routes & Controllers)

### 1. API Route Directory
Base URL: `http://localhost:5000`

| Resource | Method | Endpoint | Description |
|---|---|---|---|
| **Root** | `GET` | `/` | API Health & documentation |
| **Auth** | `POST` | `/api/users/register` | Register new user (hashes password) |
| **Auth** | `POST` | `/api/users/login` | Authenticate user credentials |
| **Users** | `GET` | `/api/users` | Retrieve all users |
| **Users** | `GET` | `/api/users/:id` | Retrieve single user by ID |
| **Users** | `DELETE`| `/api/users/:id` | Delete user and their posts |
| **Posts** | `POST` | `/api/posts` | **Create** a new post (CRUD: C) |
| **Posts** | `GET` | `/api/posts` | **Read** all posts (CRUD: R) |
| **Posts** | `GET` | `/api/posts/:id` | **Read** single post by ID (CRUD: R) |
| **Posts** | `PUT` | `/api/posts/:id` | **Update** post by ID (CRUD: U) |
| **Posts** | `DELETE`| `/api/posts/:id` | **Delete** post by ID (CRUD: D) |

---

## 📮 Step e: Testing with Postman Desktop App

### Option 1: Import the Pre-Built Postman Collection (Recommended)
1. Download and open [Postman Desktop App](https://www.postman.com/downloads/).
2. Click the **Import** button in the top-left corner.
3. Select the file [`postman_collection.json`](./postman_collection.json) located in this repository.
4. All endpoints, folders, and pre-configured test scripts will load automatically!

### Option 2: Step-by-Step Manual Testing Flow

Ensure your server is running:
```bash
npm run dev
```

#### 1. Register a User (POST `/api/users/register`)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/users/register`
- **Header:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "secretPassword123"
  }
  ```
- **Expected Status:** `201 Created`
- *Copy the returned `_id` to use as the `author` ID for creating posts.*

#### 2. Log in User (POST `/api/users/login`)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/users/login`
- **Header:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "email": "john@example.com",
    "password": "secretPassword123"
  }
  ```
- **Expected Status:** `200 OK`

#### 3. Create a Post — Create (POST `/api/posts`)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/posts`
- **Header:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "title": "My Journey into Backend Development",
    "content": "Learning Node.js, Express, and MongoDB has been an incredible experience!",
    "author": "<PASTE_USER_ID_HERE>"
  }
  ```
- **Expected Status:** `201 Created`
- *Copy the returned `_id` of the created post.*

#### 4. Get All Posts — Read All (GET `/api/posts`)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/posts`
- **Expected Status:** `200 OK`
- Verifies that `author` details (`username`, `email`) are populated.

#### 5. Get Post by ID — Read Single (GET `/api/posts/:id`)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/posts/<PASTE_POST_ID_HERE>`
- **Expected Status:** `200 OK`

#### 6. Update Post by ID — Update (PUT `/api/posts/:id`)
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/posts/<PASTE_POST_ID_HERE>`
- **Header:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "title": "My Journey into Backend Development (Updated!)",
    "content": "Successfully updated content via PUT endpoint!"
  }
  ```
- **Expected Status:** `200 OK`

#### 7. Delete Post by ID — Delete (DELETE `/api/posts/:id`)
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/posts/<PASTE_POST_ID_HERE>`
- **Expected Status:** `200 OK`
- Returns confirmation message: `"Post deleted successfully"`.

---

## 📤 Assignment Submission: Pushing to GitHub

To submit your assignment, push this code to a **public GitHub repository**:

1. **Create a New Public Repository on GitHub:**
   - Go to [GitHub: New Repository](https://github.com/new).
   - Repository name: `backend-tutorial` (or any preferred name).
   - Select **Public**.
   - Do **NOT** initialize with a README, .gitignore, or license (we already have them).
   - Click **Create repository**.

2. **Link and Push Your Code:**
   In your project directory terminal (`C:\Users\dhire\.gemini\antigravity\scratch\backend-tutorial`), run:

   ```bash
   # 1. Rename branch to main
   git branch -M main

   # 2. Add your GitHub repository remote (replace <YOUR_GITHUB_USERNAME> and <REPO_NAME>)
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<REPO_NAME>.git

   # 3. Push your code to GitHub
   git push -u origin main
   ```

3. **Submit Your Assignment:**
   - Copy your public repository URL:
     `https://github.com/<YOUR_GITHUB_USERNAME>/<REPO_NAME>`
   - Submit this link as required by your instructor / assignment portal.
