# endpoint for checklist | left join 

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import outerjoin
from datetime import datetime
from database import get_db
from models import ChecklistTask, Employee, EmployeeChecklistProgress
from schemas import ChecklistItemOut, ChecklistUpdateIn

router = APIRouter(
    prefix="/checklist",
    tags=["checklist"]
)

# GET tasks - left join between checklist_tasks and progress
@router.get("/{employee_id}", response_model=list[ChecklistItemOut])
def get_checklist_for_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")

    all_tasks = db.query(ChecklistTask).order_by(ChecklistTask.display_order).all

    existing_progress = (
        db.query(EmployeeChecklistProgress)
        .filter(EmployeeChecklistProgress.employee_id == employee_id)
        .all()
    )

    progress_by_task_id = {p.task_id: p for p in existing_progress}

    result = []

    for task in all_tasks:
        progress = progress_by_task_id(task.id)
        result.append(
            ChecklistItemOut(
                task_id = task.id,
                title = task.title,
                description = task.description,
                is_completed = progress.is_completed if progress else False
            )
        )

        return result
    

# PATCH -- upsert | task status 

@router.patch("/{employee_id}/{task_id}", response_model=ChecklistItemOut)
def update_checklist_item(
    employee_id: int,
    task_id: int,
    update: ChecklistUpdateIn,
    db: Session = Depends(get_db)
):
    task = db.query(ChecklistTask).filter(ChecklistTask.id == task_id).first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    
    progress = (
        db.query(EmployeeChecklistProgress)
        .filter(
            EmployeeChecklistProgress.employee_id == employee_id,
            EmployeeChecklistProgress.task_id == task_id
        ).first()
    )

    if progress:
        progress.is_completed = update.is_completed
        progress.completed_at = datetime.now() if update.is_completed else None
    else:
        progress = EmployeeChecklistProgress(
            employee_id = employee_id,
            task_id = task_id,
            is_completed = update.is_completed,
            completed_at = datetime.now() if update.is_completed else None
        )    
        db.add(progress)

    db.commit()
    db.refresh(progress)

    return ChecklistItemOut(
        task_id = task.id,
        title = task.title,
        description = task.description,
        is_completed = progress.is_completed
    )
