from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session, joinedload
from datetime import date
from database import get_db
from models import Employee, ChecklistTask, EmployeeSchedule, Department, EmployeeChecklistProgress
from schemas import (
    EmployeeCreateFull, EmployeeOut,
    ChecklistTaskCreate, ChecklistTaskOut, ChecklistTaskUpdate,
    ScheduleUpdateIn, ScheduleOut
)
from auth_utils import hash_password

router = APIRouter(
    prefix="/hr",
    tags=["hr"]
)

def require_hr_role(x_employee_id: int = Header(...), db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == x_employee_id).first()

    if not employee:
        raise HTTPException(status_code=401, detail="Employee not found!")

    if employee.role != "hr":
        raise HTTPException(
            status_code=403,
            detail="Only HR have access!"
        )
    return employee

@router.post("/employees", response_model=EmployeeOut)
def create_employee(
    employee_data: EmployeeCreateFull,
    db: Session = Depends(get_db),
    hr_user: Employee = Depends(require_hr_role)
):
    existing = db.query(Employee).filter(Employee.email == employee_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Existing email!")
    
    dept = db.query(Department).filter(Department.id == employee_data.department_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found!")

    new_employee = Employee(
        full_name=employee_data.full_name,
        email=employee_data.email,
        role_title=employee_data.role_title,
        department_id=employee_data.department_id,
        start_date=employee_data.start_date,
        role=employee_data.role,
        password_hash=hash_password(employee_data.password)
    )

    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)

    return (
        db.query(Employee)
        .options(joinedload(Employee.department))
        .filter(Employee.id == new_employee.id)
        .first()
    )

@router.post("/tasks", response_model=ChecklistTaskOut)
def create_checklist_task(
    task_data: ChecklistTaskCreate,
    db: Session = Depends(get_db),
    hr_user: Employee = Depends(require_hr_role)
):
    new_task = ChecklistTask(
        title=task_data.title,
        description=task_data.description,
        display_order=task_data.display_order
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.put("/tasks/{task_id}", response_model=ChecklistTaskOut)
def update_checklist_task(
    task_id: int,
    task_data: ChecklistTaskUpdate,
    db: Session = Depends(get_db),
    hr_user: Employee = Depends(require_hr_role)
):
    task = db.query(ChecklistTask).filter(ChecklistTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task_data.title is not None:
        task.title = task_data.title
    if task_data.description is not None:
        task.description = task_data.description
    if task_data.display_order is not None:
        task.display_order = task_data.display_order

    db.commit()
    db.refresh(task)
    return task


@router.delete("/tasks/{task_id}")
def delete_checklist_task(
    task_id: int,
    db: Session = Depends(get_db),
    hr_user: Employee = Depends(require_hr_role)
):
    task = db.query(ChecklistTask).filter(ChecklistTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.query(EmployeeChecklistProgress).filter(
        EmployeeChecklistProgress.task_id == task_id
    ).delete()

    db.delete(task)
    db.commit()
    return {"message": "Task deleted", "task_id": task_id}


@router.get("/tasks", response_model=list[ChecklistTaskOut])
def get_all_tasks(
    db: Session = Depends(get_db),
    hr_user: Employee = Depends(require_hr_role)
):
    return db.query(ChecklistTask).order_by(ChecklistTask.display_order).all()


@router.put("/schedule/{employee_id}", response_model=ScheduleOut)
def update_employee_schedule(
    employee_id: int,
    schedule_data: ScheduleUpdateIn,
    db: Session = Depends(get_db),
    hr_user: Employee = Depends(require_hr_role)
):
    valid_days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    if schedule_data.day_of_week not in valid_days:
        raise HTTPException(status_code=400, detail="Invalid")

    if schedule_data.location not in ["office", "remote"]:
        raise HTTPException(status_code=400, detail="Office or remote only!")

    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    schedule_entry = (
        db.query(EmployeeSchedule)
        .filter(
            EmployeeSchedule.employee_id == employee_id,
            EmployeeSchedule.day_of_week == schedule_data.day_of_week
        )
        .first()
    )

    if schedule_entry:
        schedule_entry.location = schedule_data.location
    else:
        schedule_entry = EmployeeSchedule(
            employee_id=employee_id,
            day_of_week=schedule_data.day_of_week,
            location=schedule_data.location
        )
        db.add(schedule_entry)

    db.commit()
    db.refresh(schedule_entry)
    return schedule_entry