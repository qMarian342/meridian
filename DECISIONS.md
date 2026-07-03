# Decisions

This document explains what I chose to build, what I deliberately left out, and
why, across product, technical, and UX choices.

## Product decisions

**Which features did I include, and how did I prioritise them?**

I ranked features by a single question: what reduces first-day chaos the most?

1. **"My First Week" checklist.** The most reassuring thing on day one is a clear
   list of what to do. I built it first, because it directly answers "I don't know
   how things work." Progress is per employee, so each hire has their own state.
2. **Team Directory.** This answers "I don't know anyone" with a browsable list of
   colleagues, their roles, and departments. I added a department filter so a
   200-person company stays navigable.
3. **Hybrid Schedule.** In a model of 3 office days and 2 remote days, "should I go
   in today?" is a real daily question. It shows who is in the office today and the
   new hire's own week in one place.
4. **Authentication and roles.** I started the MVP without login and with a single
   hardcoded user, then changed direction and added it. A real login lets the app
   tell a regular employee apart from HR, ties checklist progress to the person
   who is actually signed in, and is the gate that the HR features sit behind.
5. **HR Panel.** With roles in place, HR needed a way to do their work in the app
   rather than in the database. The panel lets HR add employees, add, edit, and
   delete checklist tasks, and set an employee's location for a given weekday.

**What did I intentionally leave out of scope?**

- **Editing and deactivating existing employees.** HR can create employees, but
  not yet change or archive them. This is next HR feature.
- **Per-department or per-role checklists.** Every hire currently gets the same
  list.
- **Directory search** beyond the department filter.
- **Notifications, reminders, and analytics.**
- **A hardened session layer.**

## Technical decisions

**Why this database structure?**

- I split the checklist into two tables: `checklist_tasks`, which is shared and
  global, and `employee_checklist_progress`, which is per employee. This avoids
  duplicating the task list for every hire, and it lets a brand new employee have
  zero progress rows while still seeing the full checklist. The endpoint left-joins
  tasks against progress and defaults missing rows to not completed. A progress row
  is only created, through an upsert, when someone actually ticks a task.
- `employee_schedule` uses enums for the day (Monday to Friday) and the location
  (office or remote), which keeps the data constrained and the queries simple.
- Departments are their own table with a foreign key from employees. Besides being
  properly normalised, this powers the directory filter and the add-employee
  dropdown, and it is exposed as its own `/departments` resource`.
- Employees carry a `role` column that separates HR from regular staff, and a
  `password_hash` column so login can verify credentials without ever storing a
  plain password.


**Why these libraries / frameworks?**

I used FastAPI, SQLAlchemy, MySQL, and React with Vite - the brief's recommended
stack and one I could move quickly in. Pydantic schemas handle request/response 
validation (for example, `EmailStr` rejects malformed emails automatically). Passwords are hashed with bcrypt through passlib.

**If I had more time, what would I do differently (technically)?**

- Replace the lightweight HR check with a signed session token issued at login,
  so the server verifies something only it could have produced rather than
  trusting a value the client sends.
- Add an automated test suite (I verified endpoints with a test client and by hand).

## UX decisions

**Why this user flow?**

- The Dashboard is the landing page and deliberately combines the checklist,
  today's office list, and a slice of the new hire's own team. In one screen the
  hire sees their progress, who is around, and who their closest colleagues are.
  The dedicated pages give the full directory and the full schedule when they want
  depth.
- I placed "My Week" on the schedule page rather than on a separate route, so all
  schedule information lives in one coherent place.
- I reused a single visual language. The same office and remote badges appear in
  the today list and in the week grid, so the app feels consistent as the user
  moves around.
- HR sees exactly the same app as everyone else, with one extra link. Keeping the
  HR Panel inside the same shell, rather than as a separate admin site, meant HR
  did not have to learn a second interface.


**Did I test it with anyone? What changed after feedback?**

I did not run formal user testing. I relied on self-review and on using the app
from the new-hire persona, signing in as the seeded hire and walking through a
real first-day path. Two changes came out of that. The first was the weekend empty
state: opening the schedule on a Saturday showed a blank screen, which felt broken,
so I added a clear message for days with no one scheduled. The second was the
dashboard team section: the full directory was too much for a landing page, so I
scoped the dashboard to the hire's own department and moved the complete list to
its own page. If I were to take this further, the obvious step is to sit a real
new hire in front of it and watch where they hesitate or what other needs he have.

