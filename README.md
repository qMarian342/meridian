# Meridian App

An onboarding web app for new hires at Meridian, a 200-person company with a
hybrid (3 office / 2 remote) work model. It gives a new employee everything they
need on day one, in one place:

- **My First Week** — a personal onboarding checklist you can tick off (setup Slack, meet HR, etc.).
- **Team Directory** — every colleague with their department and role.
- **Hybrid Schedule** — who is in the office today and who is remote, with an office/remote filter.
- **HR Panel**: a role-restricted area where HR adds employees, manages checklist tasks, and edits weekly schedules.

---

## Tech stack

| Layer     | Technology                          |
| --------- | ----------------------------------- |
| Backend   | Python, FastAPI, SQLAlchemy ORM     |
| Database  | MySQL                               |
| Frontend  | React (Vite), functional components + Hooks |
| Auth      | Email and password login, bcrypt password hashes |


---

## Prerequisites

Make sure these are installed before you start:

- **Python 3.11+**
- **Node.js 18+** and npm
- **MySQL 8+** running locally

---

## Getting started

### 1. Backend

From the project root:

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS / Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create the (empty) MySQL database. In the MySQL client run:

```sql
CREATE DATABASE meridian;
```

Create a file named **`.env`** inside the `backend/` folder with your connection
string (replace the user and password with your own):

```env
DATABASE_URL=mysql+pymysql://root:yourpassword@localhost:3306/meridian
```


Build the tables and fill them with sample data:

```bash
python seed.py
```

You should see a confirmation that 5 departments, 10 employees, 8 checklist tasks
and the weekly schedules were created. 

Note: `seed.py` **drops and recreates** every table on each run, giving a clean, predictable state — for demos, but
don't run it against data you want to keep.

Start the API:

```bash
uvicorn main:app --reload
```

The API now runs at **http://localhost:5173**.
Interactive API docs (Swagger UI) are at **http://127.0.0.1:8000/docs**.

### 2. Frontend

In a **second terminal**, from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser. The frontend expects the backend
to be running at `http://127.0.0.1:8000` (this is why the backend is started first).

---

### 3. Logging in

The seed script creates two accounts you can use right away:

| Role          | Email                        | Password    |
| ------------- | ---------------------------- | ----------- |
| HR            | elena.radu@meridian.co       | hr123       |
| New hire      | marian.ionescu@meridian.co   | newbie123   |

Log in as the new hire to see the standard onboarding experience. Log in as HR
to see the same app plus the HR Panel in the navigation.
---

## Project structure

```
meridian/
  backend/
    main.py            # FastAPI app, CORS, router registration
    database.py        # MySQL connection and session factory
    models.py          # SQLAlchemy models (the database tables)
    schemas.py         # Pydantic schemas (request and response shapes)
    auth_utils.py      # Password hashing and verification (bcrypt)
    seed.py            # Creates tables and inserts sample data
    requirements.txt
    routers/
      auth.py          # /auth/login
      employees.py     # /employees
      checklist.py     # /checklist
      schedule.py      # /schedule
      departments.py   # /departments
      hr.py            # /hr, HR-only actions

  frontend/
    src/
      components/      # UserCard, ChecklistItem, ScheduleCard, ProtectedRoute
      pages/           # Login, Dashboard, TeamDirectory, HybridSchedule, HrPanel
      api.js           # All fetch calls to the backend
      auth.js          # Reads the current user from local storage
      AuthContext.jsx  # Login state shared across the app
      App.jsx          # Routes and navigation
      main.jsx
```
---

## Notes

- **"Today" on weekends.** Schedules only cover Monday–Friday, so the "who's in
  today" view is empty on Saturdays and Sundays. The UI shows a friendly empty
  state in that case.