# define accepted json data - pydantic describe API*

from pydantic import BaseModel, EmailStr
from datetime import date, datetime 
from typing import Optional

class DepartmentOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class EmployeeCreate(BaseModel):
    full_name: str
    email: EmailStr
    role_title: str
    department_id: int
    start_date: date


class EmployeeOut(BaseModel):
    id: int
    full_name: str
    email: str
    role_title: str
    start_date: date
    department: DepartmentOut

    class Config:
        from_attributes = True


class ChecklistItemOut(BaseModel):
    task_id: int
    title: str
    description: Optional[str] = None
    is_completed: bool

    class Config:
        from_attributes = True


class ChecklistUpdateIn(BaseModel):
    is_completed: bool


class ScheduleOut(BaseModel):
    day_of_week: str
    location: str

    class Config:
        from_attributes = True


class TodayScheduleOut(BaseModel):
    employee_id: int
    full_name: str
    department_name: str
    location: str

    class Config:
        from_attributes = True

