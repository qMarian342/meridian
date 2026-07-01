from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from datetime import datetime
from database import get_db
from models import EmployeeSchedule, Employee
from schemas import TodayScheduleOut, ScheduleOut

router = APIRouter(
    prefix="/schedule",
    tags=["schedule"]
)

# GET all employees current day
@router.get("/today", response_model=list[TodayScheduleOut])
def get_today_schedule(db: Session = Depends(get_db)):
    today = datetime.now().strftime("%A")

    schedule = (
        db.query(EmployeeSchedule).options(
            joinedload(EmployeeSchedule.employee)
            .joinedload(Employee.department)
        ).filter(EmployeeSchedule.day_of_week == today)
        .all()
    )

    result = []
    for s in schedule:
        result.append(
            TodayScheduleOut(
                employee_id=s.employee.id,
                full_name=s.employee.full_name,
                department_name=s.employee.department.name,
                location=s.location
            )
        )
    
    return result

# GET optional condition
@router.get("/today/filter", response_model=list[TodayScheduleOut])
def get_today_schedule_by_location(
    location : str | None = None,
    db: Session = Depends(get_db)
):
    today = datetime.now().strftime("%A")

    query = (
        db.query(EmployeeSchedule).options(
            joinedload(EmployeeSchedule.employee)
            .joinedload(Employee.department)
        ).filter(EmployeeSchedule.day_of_week == today)
    )

    if location:
        if location not in ["office", "remote"]:
            raise HTTPException(
                status_code=400,
                detail="Location have to be remote/office only"
            )
        query = query.filter(EmployeeSchedule.location == location)

    schedules = query.all()

    result = []
    for s in schedules:
        result.append(
            TodayScheduleOut(
                employee_id=s.employee.id,
                full_name=s.employee.full_name,
                department_name=s.employee.department.name,
                location=s.location
            )
        )

    return result


# GET all schedule
@router.get("/{employee_id}", response_model=list[ScheduleOut])
def get_employee_schedule(employee_id: int, db: Session = Depends(get_db)):
   
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")

    day_order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

    schedules = (
        db.query(EmployeeSchedule)
        .filter(EmployeeSchedule.employee_id == employee_id)
        .all()
    )

    schedules.sort(key=lambda s: day_order.index(s.day_of_week))

    return schedules