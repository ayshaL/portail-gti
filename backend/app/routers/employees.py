from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.schemas import Employee, MonthlyRecord, EmployeeCreate, EmployeeOut, RecordCreate, RecordOut
from app.models.gpi import compute_gpi

router = APIRouter(prefix="/employees", tags=["employees"])

@router.get("/", response_model=list[EmployeeOut])
def list_employees(db: Session = Depends(get_db)):
    return db.query(Employee).all()

@router.post("/", response_model=EmployeeOut)
def create_employee(payload: EmployeeCreate, db: Session = Depends(get_db)):
    emp = Employee(**payload.dict())
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return emp

@router.get("/{employee_id}", response_model=EmployeeOut)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    emp = db.query(Employee).get(employee_id)
    if not emp:
        raise HTTPException(404, "Collaborateur introuvable")
    return emp

@router.delete("/{employee_id}")
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    emp = db.query(Employee).get(employee_id)
    if not emp:
        raise HTTPException(404, "Collaborateur introuvable")
    db.delete(emp)
    db.commit()
    return {"deleted": True}

@router.post("/{employee_id}/records", response_model=RecordOut)
def add_monthly_record(employee_id: int, payload: RecordCreate, db: Session = Depends(get_db)):
    emp = db.query(Employee).get(employee_id)
    if not emp:
        raise HTTPException(404, "Collaborateur introuvable")

    score = compute_gpi(payload.assiduite, payload.velocite, payload.qualite, payload.delais)
    record = MonthlyRecord(employee_id=employee_id, score=score, **payload.dict())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/{employee_id}/records", response_model=list[RecordOut])
def get_records(employee_id: int, db: Session = Depends(get_db)):
    return db.query(MonthlyRecord).filter(MonthlyRecord.employee_id == employee_id).order_by(MonthlyRecord.month).all()