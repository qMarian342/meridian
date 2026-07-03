from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from database import get_db
from models import Employee
from schemas import LoginIn, LoginOut
from auth_utils import verify_password

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.post("/login", response_model=LoginOut)
def login(credentials: LoginIn, db: Session = Depends(get_db)):
    employee = (
        db.query(Employee)
        .options(joinedload(Employee.department))
        .filter(Employee.email == credentials.email)
        .first()
    )

    if not employee or not verify_password(credentials.password, employee.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password! Try again!"
        )

    return employee