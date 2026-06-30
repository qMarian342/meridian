# endpoint with fastapi

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from database import get_db
from models import Employee
from schemas import EmployeeOut

router = APIRouter(
    prefix="/employees",
    tags=["employees"]
)

# GET - all employees
@router.get("/", response_model=list[EmployeeOut])
def get_all_employees(db: Session = Depends(get_db)):
    employees = db.query(Employee).options(joinedload(Employee.department)).all()

    return employees

# GET employees where id = ?
@router.get("/{employee_id}", response_model=EmployeeOut)
def get_employee_by_id(employee_id: int, db: Session = Depends(get_db)):
    employee = (
        db.query(Employee)
        .options(joinedload(Employee.department))
        .filter(Employee.id == employee_id)
        .first()
    )

    if employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    return employee
