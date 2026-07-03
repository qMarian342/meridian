from datetime import date, datetime
from database import Base, engine, SessionLocal
from models import Department, Employee, ChecklistTask, EmployeeChecklistProgress, EmployeeSchedule
from auth_utils import hash_password

WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

def reset_tables():
    """Drops all tables and recreates them from scratch."""
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

def week_for(employee, office_days):
    """Generates a 5-day schedule for an employee based on their office days."""
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
        # 1. Create Departments
        engineering = Department(name="Engineering")
        sales = Department(name="Sales")
        marketing = Department(name="Marketing")
        hr = Department(name="HR")
        finance = Department(name="Finance")
        
        db.add_all([engineering, sales, marketing, hr, finance])
        db.flush()

        # 2. Create Employees
        new_hire = Employee(
            full_name="Marian Ionescu",
            email="marian.ionescu@meridian.co",
            role_title="Junior Software Developer",
            department=engineering,
            start_date=date.today(),
            role="newbie",
            password_hash=hash_password("newbie123")
        )
        db.add(new_hire)
        db.flush()

        # HR Employee - has access to the admin panel
        elena = Employee(
            full_name="Elena Radu",
            email="elena.radu@meridian.co",
            role_title="People Operations Lead",
            department=hr,
            start_date=date(2021, 3, 15),
            role="hr",
            password_hash=hash_password("hr123")
        )

        # Existing Colleagues
        andrei = Employee(
            full_name="Andrei Pop", email="andrei.pop@meridian.co",
            role_title="Senior Software Engineer", department=engineering,
            start_date=date(2020, 6, 1), role="newbie",
            password_hash=hash_password("newbie123")
        )
        ioana = Employee(
            full_name="Ioana Marin", email="ioana.marin@meridian.co",
            role_title="Backend Engineer", department=engineering,
            start_date=date(2022, 9, 12), role="newbie",
            password_hash=hash_password("newbie123")
        )
        cristian = Employee(
            full_name="Cristian Dumitru", email="cristian.dumitru@meridian.co",
            role_title="Account Executive", department=sales,
            start_date=date(2021, 11, 8), role="newbie",
            password_hash=hash_password("newbie123")
        )
        ana = Employee(
            full_name="Ana Stan", email="ana.stan@meridian.co",
            role_title="Sales Manager", department=sales,
            start_date=date(2019, 4, 22), role="newbie",
            password_hash=hash_password("newbie123")
        )
        vlad = Employee(
            full_name="Vlad Georgescu", email="vlad.georgescu@meridian.co",
            role_title="Content Strategist", department=marketing,
            start_date=date(2023, 1, 30), role="newbie",
            password_hash=hash_password("newbie123")
        )
        diana = Employee(
            full_name="Diana Constantin", email="diana.constantin@meridian.co",
            role_title="Marketing Lead", department=marketing,
            start_date=date(2020, 10, 5), role="newbie",
            password_hash=hash_password("newbie123")
        )
        bogdan = Employee(
            full_name="Bogdan Matei", email="bogdan.matei@meridian.co",
            role_title="Financial Analyst", department=finance,
            start_date=date(2022, 2, 14), role="newbie",
            password_hash=hash_password("newbie123")
        )
        raluca = Employee(
            full_name="Raluca Dinu", email="raluca.dinu@meridian.co",
            role_title="Finance Manager", department=finance,
            start_date=date(2018, 7, 3), role="newbie",
            password_hash=hash_password("newbie123")
        )

        colleagues = [elena, andrei, ioana, cristian, ana, vlad, diana, bogdan, raluca]
        db.add_all(colleagues)
        db.flush()

        # 3. Create Checklist Tasks
        tasks = [
            ChecklistTask(display_order=1, title="Set up your Slack account",
                          description="Slack is where day-to-day communication happens."),
            ChecklistTask(display_order=2, title="Install Google Meet",
                          description="Most meetings at Meridian are on Google Meet."),
            ChecklistTask(display_order=3, title="Meet Elena from HR",
                          description="Elena handles benefits, questions, and paperwork."),
            ChecklistTask(display_order=4, title="Activate your Meridian email",
                          description="Check your inbox for the activation link from IT."),
            ChecklistTask(display_order=5, title="Read the Employee Handbook",
                          description="Covers policies, holidays, and how we work."),
            ChecklistTask(display_order=6, title="Complete IT security training",
                          description="A short course on passwords, phishing, and 2FA."),
            ChecklistTask(display_order=7, title="Meet your team lead, Andrei",
                          description="Andrei will walk you through your first project."),
            ChecklistTask(display_order=8, title="Set up your development environment",
                          description="Clone the repo and get the app running locally."),
        ]
        db.add_all(tasks)
        db.flush()

        # 4. Generate Schedules
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
        db.commit()
        
        print("Done: 5 departments, 10 employees (1 HR + 9 newbie), 8 tasks seeded.")
        print("Login HR: elena.radu@meridian.co / hr123")
        print("Login Newbie: marian.ionescu@meridian.co / newbie123")
        
    except Exception as e:
        db.rollback()
        print(f"An error occurred: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("Resetting tables...")
    reset_tables()
    print("Inserting sample data...")
    seed()