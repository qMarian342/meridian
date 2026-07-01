"""
seed.py -- creates all database tables and fills them with sample data.

WHY THIS FILE EXISTS
SQLAlchemy models describe the tables, but nothing creates them automatically.


HOW IT WORKS
It DROPS and recreates every table, then inserts fresh data. That means every
run gives the exact same clean, known state - only for demo!!
Because it drops tables, do NOT run it against data you want to keep.

RUN IT WITH:
    python seed.py
(after creating the empty MySQL database -- see the README).
"""

from datetime import date, datetime

from database import Base, engine, SessionLocal
from models import (
    Department,
    Employee,
    ChecklistTask,
    EmployeeChecklistProgress,
    EmployeeSchedule,
)

WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]


def reset_tables():
#   Wipe everything and rebuild the schema from models.py
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def week_for(employee, office_days):
 #  Return five EmployeeSchedule rows (one per weekday) for one employee.
    
    return [
        EmployeeSchedule(
            employee=employee,
            day_of_week=day,
            location="office" if day in office_days else "remote",
        )
        for day in WEEKDAYS
    ]


def seed():
    db = SessionLocal()
    try:
        # Departments 
        engineering = Department(name="Engineering")
        sales = Department(name="Sales")
        marketing = Department(name="Marketing")
        hr = Department(name="HR")
        finance = Department(name="Finance")
        db.add_all([engineering, sales, marketing, hr, finance])
        db.flush()  # assign ids now, without committing yet

        # The new hire (Employee id = 1)
        # The frontend hardcodes CURRENT_EMPLOYEE_ID = 1, so this person is
        # "you" in the dashboard demo.

        new_hire = Employee(
            full_name="Marian Ionescu",
            email="marian.ionescu@meridian.co",
            role_title="Junior Software Developer",
            department=engineering,
            start_date=date.today(),  # starts today 
        )
        db.add(new_hire)
        db.flush()

        # he rest of the team 

        elena = Employee(full_name="Elena Radu", email="elena.radu@meridian.co",
                         role_title="People Operations Lead", department=hr,
                         start_date=date(2021, 3, 15))
        andrei = Employee(full_name="Andrei Pop", email="andrei.pop@meridian.co",
                          role_title="Senior Software Engineer", department=engineering,
                          start_date=date(2020, 6, 1))
        ioana = Employee(full_name="Ioana Marin", email="ioana.marin@meridian.co",
                         role_title="Backend Engineer", department=engineering,
                         start_date=date(2022, 9, 12))
        cristian = Employee(full_name="Cristian Dumitru", email="cristian.dumitru@meridian.co",
                            role_title="Account Executive", department=sales,
                            start_date=date(2021, 11, 8))
        ana = Employee(full_name="Ana Stan", email="ana.stan@meridian.co",
                       role_title="Sales Manager", department=sales,
                       start_date=date(2019, 4, 22))
        vlad = Employee(full_name="Vlad Georgescu", email="vlad.georgescu@meridian.co",
                        role_title="Content Strategist", department=marketing,
                        start_date=date(2023, 1, 30))
        diana = Employee(full_name="Diana Constantin", email="diana.constantin@meridian.co",
                         role_title="Marketing Lead", department=marketing,
                         start_date=date(2020, 10, 5))
        bogdan = Employee(full_name="Bogdan Matei", email="bogdan.matei@meridian.co",
                          role_title="Financial Analyst", department=finance,
                          start_date=date(2022, 2, 14))
        raluca = Employee(full_name="Raluca Dinu", email="raluca.dinu@meridian.co",
                          role_title="Finance Manager", department=finance,
                          start_date=date(2018, 7, 3))

        colleagues = [elena, andrei, ioana, cristian, ana, vlad, diana, bogdan, raluca]
        db.add_all(colleagues)
        db.flush()

        # Checklist tasks (shared by everyone) 
        # display_order controls the order they appear in the UI.

        tasks = [
            ChecklistTask(display_order=1, title="Set up your Slack account and join #general",
                          description="Slack is where day-to-day communication happens."),
            ChecklistTask(display_order=2, title="Install Google Meet and test your camera and mic",
                          description="Most meetings at Meridian are on Google Meet."),
            ChecklistTask(display_order=3, title="Meet Elena from HR (your onboarding contact)",
                          description="Elena handles benefits, questions, and paperwork."),
            ChecklistTask(display_order=4, title="Activate your Meridian email account",
                          description="Check your inbox for the activation link from IT."),
            ChecklistTask(display_order=5, title="Read the Employee Handbook",
                          description="Covers policies, holidays, and how we work."),
            ChecklistTask(display_order=6, title="Complete the IT security training",
                          description="A short course on passwords, phishing, and 2FA."),
            ChecklistTask(display_order=7, title="Meet your team lead, Andrei",
                          description="Andrei will walk you through your first project."),
            ChecklistTask(display_order=8, title="Set up your development environment",
                          description="Clone the repo and get the app running locally."),
        ]
        db.add_all(tasks)
        db.flush()

        # Weekly schedules (hybrid: 3 office, 2 remote) 
        schedule_rows = []
        schedule_rows += week_for(new_hire, {"Monday", "Tuesday", "Wednesday"})
        schedule_rows += week_for(elena,    {"Monday", "Wednesday", "Friday"})
        schedule_rows += week_for(andrei,   {"Tuesday", "Wednesday", "Thursday"})
        schedule_rows += week_for(ioana,    {"Monday", "Thursday", "Friday"})
        schedule_rows += week_for(cristian, {"Monday", "Tuesday", "Friday"})
        schedule_rows += week_for(ana,      {"Wednesday", "Thursday", "Friday"})
        schedule_rows += week_for(vlad,     {"Monday", "Wednesday", "Thursday"})
        schedule_rows += week_for(diana,    {"Tuesday", "Thursday", "Friday"})
        schedule_rows += week_for(bogdan,   {"Monday", "Tuesday", "Wednesday"})
        schedule_rows += week_for(raluca,   {"Monday", "Wednesday", "Friday"})
        db.add_all(schedule_rows)

        db.add_all([
            EmployeeChecklistProgress(employee=new_hire, task=tasks[0],
                                      is_completed=True, completed_at=datetime.now()),
            EmployeeChecklistProgress(employee=new_hire, task=tasks[1],
                                      is_completed=True, completed_at=datetime.now()),
        ])

        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    print("Resetting tables (dropping and recreating)...")
    reset_tables()
    print("Inserting sample data...")
    seed()
    print("Done: 5 departments, 10 employees, 8 checklist tasks, weekly schedules seeded.")
    print("The new hire is Employee id = 1 (matches CURRENT_EMPLOYEE_ID in the frontend).")