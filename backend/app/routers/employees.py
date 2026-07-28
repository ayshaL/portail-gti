"""
Every function here becomes a URL your website can call, e.g.:
    GET    /employees/                     -> list all employee IDs
    GET    /employees/4291                 -> all performance rows for employee 4291
    GET    /employees/4291/latest          -> most recent performance row
    GET    /employees/4291/profile         -> employee's HR profile
    POST   /employees/profile              -> create a new employee profile
    PUT    /employees/4291/profile         -> replace an employee's profile
    DELETE /employees/4291/profile         -> delete an employee's profile

`router = APIRouter()` creates a mini FastAPI app just for this file.
main.py then "mounts" it, so these routes become part of the real app.
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.employee import Employee
from app.models.tables import ProcessedResult
from app.models.schemas import Employee as EmployeeSchema
from app.models.schemas import EmployeeCreate, EmployeeUpdate
from app.models.schemas import ProcessedResult as ProcessedResultSchema

router = APIRouter(
    prefix="/employees",
    tags=["employees"],
)


@router.get("/", response_model=List[int])
def list_employee_ids(db: Session = Depends(get_db)):
    """Returns every distinct employee ID (usr_matricule) in the table."""
    rows = db.query(ProcessedResult.usr_matricule).distinct().all()
    # `rows` is a list of one-item tuples like [(4291,), (4292,)], so unwrap them
    return [row[0] for row in rows]


@router.get("/{usr_matricule}", response_model=List[ProcessedResultSchema])
def get_employee_history(usr_matricule: int, db: Session = Depends(get_db)):
    """Returns every row (every month) for one employee, oldest first."""
    rows = (
        db.query(ProcessedResult)
        .filter(ProcessedResult.usr_matricule == usr_matricule)
        .order_by(ProcessedResult.period.asc())
        .all()
    )
    if not rows:
        # 404 = "not found", the standard HTTP way to say "nothing here"
        raise HTTPException(status_code=404, detail="Employee not found")
    return rows


@router.get("/{usr_matricule}/latest", response_model=ProcessedResultSchema)
def get_employee_latest(usr_matricule: int, db: Session = Depends(get_db)):
    """Returns only the most recent row for one employee."""
    row = (
        db.query(ProcessedResult)
        .filter(ProcessedResult.usr_matricule == usr_matricule)
        .order_by(ProcessedResult.period.desc())
        .first()
    )
    if row is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return row


# ---------------------------------------------------------------------------
# Employee profile CRUD (name, department, skills, etc. -- the `employees`
# table, separate from the monthly performance rows above)
# ---------------------------------------------------------------------------

@router.get("/{usr_matricule}/profile", response_model=EmployeeSchema)
def get_employee_profile(usr_matricule: int, db: Session = Depends(get_db)):
    """READ: fetch one employee's HR profile."""
    employee = db.query(Employee).filter(Employee.usr_matricule == usr_matricule).first()
    if employee is None:
        raise HTTPException(status_code=404, detail="Employee profile not found")
    return employee


@router.post("/profile", response_model=EmployeeSchema, status_code=201)
def create_employee_profile(payload: EmployeeCreate, db: Session = Depends(get_db)):
    """CREATE: add a new employee profile."""
    existing = (
        db.query(Employee).filter(Employee.usr_matricule == payload.usr_matricule).first()
    )
    if existing is not None:
        # 409 = "conflict" -- the standard HTTP way to say "this already exists"
        raise HTTPException(status_code=409, detail="Employee profile already exists")

    # payload.parcours is a Pydantic object (Parcours) at this point; the
    # database column is JSON, so we convert it to a plain dict first.
    data = payload.model_dump()
    data["parcours"] = payload.parcours.model_dump()

    employee = Employee(**data)
    db.add(employee)
    db.commit()
    db.refresh(employee)  # reloads the row so we return exactly what's stored
    return employee


@router.put("/{usr_matricule}/profile", response_model=EmployeeSchema)
def update_employee_profile(
    usr_matricule: int, payload: EmployeeUpdate, db: Session = Depends(get_db)
):
    """UPDATE: change one or more fields on an existing employee profile."""
    employee = db.query(Employee).filter(Employee.usr_matricule == usr_matricule).first()
    if employee is None:
        raise HTTPException(status_code=404, detail="Employee profile not found")

    # exclude_unset=True means "only include fields the caller actually sent" --
    # so fields left out of the request body are left untouched in the database.
    updates = payload.model_dump(exclude_unset=True)
    if "parcours" in updates and updates["parcours"] is not None:
        updates["parcours"] = payload.parcours.model_dump()

    for field, value in updates.items():
        setattr(employee, field, value)

    db.commit()
    db.refresh(employee)
    return employee


@router.delete("/{usr_matricule}/profile", status_code=204)
def delete_employee_profile(usr_matricule: int, db: Session = Depends(get_db)):
    """DELETE: remove an employee's profile."""
    employee = db.query(Employee).filter(Employee.usr_matricule == usr_matricule).first()
    if employee is None:
        raise HTTPException(status_code=404, detail="Employee profile not found")

    db.delete(employee)
    db.commit()
    return None