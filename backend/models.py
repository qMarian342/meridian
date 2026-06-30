# defining tables as class for SQLAlchemy

from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey, TIMESTAMP, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)

    employees = relationship("Employee", back_populates="department")

class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    role_title = Column(String(100), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    start_date = Column(Date, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    department = relationship("Department", back_populates="employees")
    checklist_progress = relationship("EmployeeChecklistProgress", back_populates="employee")
    schedule = relationship("EmployeeSchedule", back_populates="employee")

class ChecklistTask(Base):
    __tablename__ = "checklist_tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(String(500), nullable=True)
    display_order = Column(Integer, default=0)

class EmployeeChecklistProgress(Base):
    __tablename__ = "employee_checklist_progress"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    task_id = Column(Integer, ForeignKey("checklist_tasks.id"), nullable=False)
    is_completed = Column(Boolean, default=False, nullable=False)
    completed_at = Column(TIMESTAMP, nullable=True)

    employee = relationship("Employee", back_populates="checklist_progress")
    task = relationship("ChecklistTask")

class EmployeeSchedule(Base):
    __tablename__ = "employee_schedule"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    day_of_week = Column(
        Enum("Monday", "Tuesday", "Wednesday", "Thursday", "Friday"),
        nullable=False
    )
    location = Column(Enum("office", "remote"), nullable=False)

    employee = relationship("Employee", back_populates="schedule")
