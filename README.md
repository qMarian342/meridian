# Meridian App

An onboarding web app for new hires at Meridian, a 200-person company with a
hybrid (3 office / 2 remote) work model. It gives a new employee everything they
need on day one, in one place:

- **My First Week** — a personal onboarding checklist you can tick off (setup Slack, meet HR, etc.).
- **Team Directory** — every colleague with their department and role.
- **Hybrid Schedule** — who is in the office today and who is remote, with an office/remote filter.

---

## Tech stack

| Layer     | Technology                          |
| --------- | ----------------------------------- |
| Backend   | Python, FastAPI, SQLAlchemy ORM     |
| Database  | MySQL                               |
| Frontend  | React (Vite), functional components + Hooks |

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

The API now runs at **http://127.0.0.1:8000**.
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

## Project structure

```
meridian/
	-backend/
		main.py            # FastAPI app + CORS + router registration
		database.py        # MySQL connection and session factory
		models.py          # SQLAlchemy models (the database tables)
		schemas.py         # Pydantic schemas (request/response shapes)
		seed.py            # Creates tables and inserts sample data
		requirements.txt

		-routers/
			employees.py    # /employees endpoints
			checklist.py    # /checklist endpoints
			schedule.py     # /schedule endpoints

	-frontend/
		src/
			components/      # Reusable UI (UserCard, ChecklistItem, ScheduleCard)
			pages/           # Dashboard, TeamDirectory, HybridSchedule
			api.js           # All fetch calls to the backend
			...
```

---

## Notes

- **No authentication.** Auth was left out of the MVP. The app
  assumes a single logged-in user, hardcoded as `CURRENT_EMPLOYEE_ID = 1` in the
  frontend — this is the seeded new hire (Marian Ionescu, Engineering). The
  reasoning behind this and other choices is documented in `ASSUMPTIONS.md` and
  `DECISIONS.md`.
- **"Today" on weekends.** Schedules only cover Monday–Friday, so the "who's in
  today" view is empty on Saturdays and Sundays. The UI shows a friendly empty
  state in that case.