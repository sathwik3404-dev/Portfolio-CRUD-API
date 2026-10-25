# Sathwik Ananthula - Full-Stack Portfolio & Projects CRUD REST API

**Assignment 2: Build a CRUD REST API with Authentication Using My Existing Portfolio**  
**Student:** Sathwik Ananthula  
**GitHub Profile:** [https://github.com/sathwik3404-dev](https://github.com/sathwik3404-dev)  
**Repository:** [https://github.com/sathwik3404-dev/portfolio](https://github.com/sathwik3404-dev/portfolio)

---

## 1. Project Overview

This repository converts my personal portfolio website (Assignment 1) into a secure, production-ready full-stack web application (Assignment 2). 

The application integrates a **Django REST Framework (DRF)** backend with **Token-Based Authentication** and full **CRUD (Create, Read, Update, Delete)** capabilities for portfolio projects. The frontend preserves my existing responsive portfolio design, animations, typography, and personal project cards, while introducing an integrated **Admin Portal** (`admin.html`) allowing authenticated users to register, sign in, and manage their portfolio projects in real time.

---

## 2. Key Features

- **Responsive Portfolio Frontend:** Maintains the original responsive layout, semantic structure, custom typography (*Saira Extra Condensed* and *Mulish*), and IoT/Web project filtering.
- **RESTful Architecture:** Clear, standard endpoints for authentication and project resources following REST conventions.
- **Token Authentication:** Secure token-based authentication via `rest_framework.authtoken` with `Authorization: Token <token>` headers.
- **User Ownership & Isolation:** Strict authorization prevents users from accessing, modifying, or deleting other users' project records.
- **Password Security:** Django's built-in PBKDF2 password hashing with SHA-256; plain-text passwords are never stored or returned in responses.
- **Complete CRUD Operations:** Create, Read (List and Detail), Full Update (PUT), Partial Update (PATCH), and Delete (DELETE) for portfolio projects.
- **Admin Management Portal:** Dedicated web interface (`admin.html`) with form validation, loading spinners, instant alert banners, and project editing modals.
- **Automated Test Suite:** 20 test cases verifying registration, hashing, authentication, permissions, CRUD, input validation, and user isolation.
- **CORS Configured:** Secure Cross-Origin Resource Sharing allowing seamless communication between frontend and backend.
- **Postman Ready:** Complete, pre-configured Postman Collection file (`postman_collection.json`) included for instant API testing.

---

## 3. Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (Fetch API) |
| **Backend** | Python 3, Django 6.1+, Django REST Framework (DRF) |
| **Database** | SQLite3 (Development) |
| **Authentication** | DRF `TokenAuthentication` |
| **Security & CORS** | `django-cors-headers`, Django Built-in Password Hashers |
| **Testing** | Django Test Runner (`APITestCase`), Postman |
| **Version Control** | Git, GitHub |

---

## 4. Project Folder Structure

```text
portfolio/
├── assign-1.css                        # Portfolio and Admin Portal unified styles
├── assign-1.js                         # Dynamic frontend script (with API integration)
├── index.html                          # Main personal portfolio homepage
├── admin.html                          # Admin authentication and project management portal
├── admin.js                            # Frontend client communicating with REST API
├── postman_collection.json             # Ready-to-import Postman test collection
├── .gitignore                          # Root Git ignore (protects .env, db.sqlite3, venv)
├── README.md                           # Complete project documentation
├── image/                              # Portfolio profile pictures and assets
└── backend/
    ├── manage.py                       # Django CLI management utility
    ├── requirements.txt                # Pinned backend dependencies
    ├── .env.example                    # Template for environment variables
    ├── .env                            # Local development configuration (git-ignored)
    ├── .gitignore                      # Backend-specific ignore file
    ├── config/                         # Django project configuration
    │   ├── __init__.py
    │   ├── asgi.py
    │   ├── settings.py                 # DRF, CORS, Auth, and DB configuration
    │   ├── urls.py                     # Main URL routing
    │   └── wsgi.py
    ├── accounts/                       # Authentication and user accounts app
    │   ├── __init__.py
    │   ├── admin.py
    │   ├── apps.py
    │   ├── models.py
    │   ├── serializers.py              # UserRegistration, Login & Profile serializers
    │   ├── views.py                    # RegisterView, LoginView, CurrentUserView, LogoutView
    │   ├── urls.py                     # /api/auth/ routing
    │   └── tests.py                    # 10 automated authentication & security tests
    └── projects/                       # Portfolio project management app
        ├── __init__.py
        ├── admin.py                    # Django Admin registration
        ├── apps.py
        ├── models.py                   # Project model (fields: title, desc, tech, URLs, owner)
        ├── permissions.py              # IsOwner object-level permission class
        ├── serializers.py              # ProjectSerializer & PublicProjectSerializer
        ├── views.py                    # CRUD views & Public listing view
        ├── urls.py                     # /api/projects/ routing
        ├── tests.py                    # 10 automated CRUD, validation & isolation tests
        └── management/
            └── commands/
                └── seed_portfolio.py   # Seeding command for demo user and projects
```

---

## 5. Installation & Setup Instructions

### Prerequisites
- Python 3.10+ (tested on Python 3.14)
- Git installed on your system
- A modern web browser or live server extension

### Step 1: Clone the Repository
```bash
git clone https://github.com/sathwik3404-dev/portfolio.git
cd portfolio
```

### Step 2: Set Up Python Virtual Environment
Navigate to the `backend/` directory and create a virtual environment:
```bash
cd backend
python -m venv venv
```

Activate the virtual environment:
- **Windows (PowerShell):**
  ```powershell
  .\venv\Scripts\Activate.ps1
  ```
- **Windows (Command Prompt):**
  ```cmd
  .\venv\Scripts\activate.bat
  ```
- **macOS / Linux:**
  ```bash
  source venv/bin/activate
  ```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(On Windows PowerShell: `Copy-Item .env.example .env`)*

### Step 5: Run Database Migrations
Initialize the SQLite database schema:
```bash
python manage.py makemigrations
python manage.py migrate
```

### Step 6: (Optional) Seed Demo Data
Pre-load the database with Sathwik's initial projects and a demo user:
```bash
python manage.py seed_portfolio
```
**Default Demo Credentials:**
- **Username:** `demo_user`
- **Password:** `StrongPassword123`
- **Email:** `demo@example.com`

---

## 6. Running the Development Server

### Start the Django Backend:
Inside the `backend/` folder with your virtual environment activated:
```bash
python manage.py runserver 127.0.0.1:8000
```
The REST API will be accessible at: `http://127.0.0.1:8000/api/`

### Open the Frontend:
You can open `index.html` and `admin.html` directly in your browser, or serve them using Python's built-in HTTP server or VS Code Live Server:
```bash
# In the portfolio root directory (in another terminal):
python -m http.server 5500
```
Then visit:
- **Main Portfolio:** [http://127.0.0.1:5500/index.html](http://127.0.0.1:5500/index.html)
- **Admin Management Portal:** [http://127.0.0.1:5500/admin.html](http://127.0.0.1:5500/admin.html)

---

## 7. Running Automated Tests

To run the complete automated test suite (20 tests covering registration, hashing, auth, permissions, validation, and CRUD operations):

```bash
cd backend
python manage.py test
```

### Test Coverage Summary:
- `AccountsAuthTests`:
  1. `test_user_registration_success`: Registers user and generates token.
  2. `test_password_hashing`: Asserts password is stored with PBKDF2 hash, never plain-text.
  3. `test_registration_duplicate_username`: Rejects duplicate usernames with HTTP 400.
  4. `test_registration_invalid_data`: Rejects blank username, short passwords, invalid emails.
  5. `test_successful_login`: Validates credentials and returns token.
  6. `test_invalid_login_wrong_password`: Rejects wrong password with HTTP 400.
  7. `test_invalid_login_nonexistent_user`: Rejects nonexistent user with HTTP 400.
  8. `test_current_user_with_token`: Confirms `/api/auth/me/` returns profile with valid token.
  9. `test_current_user_without_token`: Confirms `/api/auth/me/` returns HTTP 401 when unauthenticated.
  10. `test_logout`: Confirms token is revoked on logout.
- `ProjectsCRUDTests`:
  1. `test_access_projects_unauthenticated_returns_401`: Rejects unauthenticated CRUD requests.
  2. `test_create_project_with_valid_token`: Creates project (HTTP 201) and attaches owner.
  3. `test_list_projects_authenticated`: Returns only projects belonging to the logged-in user.
  4. `test_retrieve_individual_project`: Retrieves specific project by ID (HTTP 200).
  5. `test_update_project_put`: Fully updates project fields (HTTP 200).
  6. `test_partial_update_project_patch`: Partially updates specific fields (HTTP 200).
  7. `test_delete_project`: Deletes project from database (HTTP 204).
  8. `test_reject_empty_or_malformed_data`: Rejects empty title, empty description, and bad URLs.
  9. `test_prevent_one_user_accessing_another_users_projects`: Strict user isolation (returns HTTP 403 Forbidden).
  10. `test_public_projects_endpoint`: Verifies unauthenticated visitors can view public projects.

---

## 8. API Endpoint Documentation

All protected endpoints require the following HTTP header:
```http
Authorization: Token <YOUR_AUTH_TOKEN>
Content-Type: application/json
```

### Summary of Endpoints

| Method | Endpoint | Auth Required | Description | Status Code |
|---|---|---|---|---|
| `POST` | `/api/auth/register/` | No | Register a new user | `201 Created` / `400 Bad Request` |
| `POST` | `/api/auth/login/` | No | Log in and receive auth token | `200 OK` / `400 Bad Request` |
| `GET` | `/api/auth/me/` | **Yes** | Get current authenticated user profile | `200 OK` / `401 Unauthorized` |
| `POST` | `/api/auth/logout/` | **Yes** | Revoke current auth token | `200 OK` / `401 Unauthorized` |
| `GET` | `/api/projects/` | **Yes** | List authenticated user's projects | `200 OK` / `401 Unauthorized` |
| `POST` | `/api/projects/` | **Yes** | Create a new project | `201 Created` / `400 Bad Request` |
| `GET` | `/api/projects/<id>/` | **Yes** | Retrieve specific project by ID | `200 OK` / `403 Forbidden` / `404 Not Found` |
| `PUT` | `/api/projects/<id>/` | **Yes** | Full update of a project | `200 OK` / `400 Bad Request` / `403 Forbidden` |
| `PATCH` | `/api/projects/<id>/` | **Yes** | Partial update of a project | `200 OK` / `400 Bad Request` / `403 Forbidden` |
| `DELETE` | `/api/projects/<id>/` | **Yes** | Delete a project | `204 No Content` / `403 Forbidden` |
| `GET` | `/api/projects/public/` | No | Public read-only portfolio project list | `200 OK` |

---

### Request & Response Examples

#### 1. User Registration
- **Endpoint:** `POST /api/auth/register/`
- **Request Body:**
```json
{
  "username": "demo_user",
  "email": "demo@example.com",
  "password": "StrongPassword123"
}
```
- **Response (`201 Created`):**
```json
{
  "message": "User registered successfully.",
  "user": {
    "id": 1,
    "username": "demo_user",
    "email": "demo@example.com",
    "date_joined": "2026-10-25T16:00:00Z"
  },
  "token": "ff46e1a8288d06450b2b687d0f859dc8c193de5a"
}
```

#### 2. User Login
- **Endpoint:** `POST /api/auth/login/`
- **Request Body:**
```json
{
  "username": "demo_user",
  "password": "StrongPassword123"
}
```
- **Response (`200 OK`):**
```json
{
  "message": "Login successful.",
  "token": "ff46e1a8288d06450b2b687d0f859dc8c193de5a",
  "user": {
    "id": 1,
    "username": "demo_user",
    "email": "demo@example.com"
  }
}
```

#### 3. Current User Profile
- **Endpoint:** `GET /api/auth/me/`
- **Headers:** `Authorization: Token ff46e1a8288d06450b2b687d0f859dc8c193de5a`
- **Response (`200 OK`):**
```json
{
  "id": 1,
  "username": "demo_user",
  "email": "demo@example.com",
  "date_joined": "2026-10-25T16:00:00Z"
}
```

#### 4. List User Projects
- **Endpoint:** `GET /api/projects/`
- **Headers:** `Authorization: Token ff46e1a8288d06450b2b687d0f859dc8c193de5a`
- **Response (`200 OK`):**
```json
[
  {
    "id": 1,
    "title": "Fuelup: on-demand fuel delivery",
    "description": "A full-stack app that lets someone order petrol or diesel to their live location...",
    "technologies": "React, Node.js, JavaScript",
    "github_url": "https://github.com/sathwik3404-dev/fuelup",
    "live_demo_url": "https://fuelup-demo.example.com",
    "created_at": "2026-10-25T16:05:00Z",
    "updated_at": "2026-10-25T16:05:00Z",
    "owner": 1,
    "owner_username": "demo_user"
  }
]
```

#### 5. Create Project
- **Endpoint:** `POST /api/projects/`
- **Headers:** `Authorization: Token ff46e1a8288d06450b2b687d0f859dc8c193de5a`
- **Request Body:**
```json
{
  "title": "Smart Dustbin",
  "description": "A contactless bin that opens its lid using ultrasonic sensors and servo motor.",
  "technologies": "Arduino, Embedded C, Ultrasonic sensor, Servo motor",
  "github_url": "https://github.com/sathwik3404-dev/smart-dustbin",
  "live_demo_url": ""
}
```
- **Response (`201 Created`):**
```json
{
  "id": 4,
  "title": "Smart Dustbin",
  "description": "A contactless bin that opens its lid using ultrasonic sensors and servo motor.",
  "technologies": "Arduino, Embedded C, Ultrasonic sensor, Servo motor",
  "github_url": "https://github.com/sathwik3404-dev/smart-dustbin",
  "live_demo_url": "",
  "created_at": "2026-10-25T16:10:00Z",
  "updated_at": "2026-10-25T16:10:00Z",
  "owner": 1,
  "owner_username": "demo_user"
}
```

#### 6. Update Project (PUT / PATCH)
- **Endpoint:** `PATCH /api/projects/4/`
- **Headers:** `Authorization: Token ff46e1a8288d06450b2b687d0f859dc8c193de5a`
- **Request Body:**
```json
{
  "title": "Smart Contactless Dustbin v2"
}
```
- **Response (`200 OK`):**
```json
{
  "id": 4,
  "title": "Smart Contactless Dustbin v2",
  "description": "A contactless bin that opens its lid using ultrasonic sensors and servo motor.",
  "technologies": "Arduino, Embedded C, Ultrasonic sensor, Servo motor",
  "github_url": "https://github.com/sathwik3404-dev/smart-dustbin",
  "live_demo_url": "",
  "created_at": "2026-10-25T16:10:00Z",
  "updated_at": "2026-10-25T16:12:00Z",
  "owner": 1,
  "owner_username": "demo_user"
}
```

#### 7. Delete Project
- **Endpoint:** `DELETE /api/projects/4/`
- **Headers:** `Authorization: Token ff46e1a8288d06450b2b687d0f859dc8c193de5a`
- **Response:** `204 No Content`

---

## 9. Postman Testing Instructions

1. Open Postman.
2. Click **Import** (top left).
3. Drag and drop or browse to `postman_collection.json` located in the root repository folder.
4. The collection contains predefined variables:
   - `base_url`: `http://127.0.0.1:8000`
   - `auth_token`: Automatically populated upon calling the **Login** request!
   - `project_id`: Automatically captured when creating a project.
5. Execute requests in sequence:
   - **Register New User** → verifies user creation and token.
   - **Login** → automatically saves token into Postman environment.
   - **Get Current User Profile** → tests token header authentication.
   - **List User's Projects** → verifies user isolation.
   - **Create Project** → creates a new record and saves `project_id`.
   - **Update Project (PUT / PATCH)** → updates title/description.
   - **Delete Project** → removes record with HTTP 204.
   - **Negative Tests** → verifies HTTP 400 for bad data and HTTP 401 for missing tokens.

---

## 10. Frontend Integration Details

- **Admin Link:** Integrated into `index.html` navigation sidebar and projects header chip.
- **Admin Portal (`admin.html`):** Fully integrated interface for registration, login, and project CRUD.
- **Token Persistence:** Authentication token is securely saved in browser `localStorage`.
- **Error Handling:** Form errors returned by Django REST Framework (e.g. invalid username, duplicate user, bad URL) are extracted and displayed in clear red alert banners.
- **Dynamic Enhancement:** `assign-1.js` contacts `GET /api/projects/public/` when the backend is active to display live projects alongside existing static projects, with graceful fallback if the backend is offline.

---

## 11. Security Checklist

- [x] Passwords hashed using Django's PBKDF2 with SHA-256 (verified via automated test).
- [x] Sensitive variables stored in `.env`.
- [x] `.env`, `db.sqlite3`, and `venv/` added to `.gitignore`.
- [x] TokenAuthentication required for all project CRUD endpoints (unauthenticated requests rejected with HTTP 401).
- [x] Object-level permission (`IsOwner`) prevents cross-user access (unauthorized modifications rejected with HTTP 403).
- [x] Input validation for email format, password complexity, and URL schemes.
- [x] HTML escaping to protect against Cross-Site Scripting (XSS).

---

## 12. Git Commands for Submission

To review and commit your changes without altering Git history:

```bash
# Check status of modified and new files
git status

# Stage all files
git add .

# Commit with a clear, descriptive message
git commit -m "Implement Assignment 2: Django REST API with Token Auth and Portfolio CRUD integration"

# Push to your GitHub repository
git push origin main
```
