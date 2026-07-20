# claude generated (just to get an idea of the strcuture of the code)

from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from typing import List, Optional
from app.database import Base

# --- Tables SQLAlchemy ---

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    role = Column(String)
    dept = Column(String)

    records = relationship("MonthlyRecord", back_populates="employee")


class MonthlyRecord(Base):
    __tablename__ = "monthly_records"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    month = Column(String)          # ex: "2026-03"
    assiduite = Column(Float)       # taux de présence (0-100)
    velocite = Column(Float)        # tâches complétées / prévues
    qualite = Column(Float)         # % livrables conformes
    delais = Column(Float)          # % tâches livrées à temps
    score = Column(Float)           # GPI calculé

    employee = relationship("Employee", back_populates="records")


# --- Schémas Pydantic (entrée/sortie API) ---

class EmployeeCreate(BaseModel):
    name: str
    role: Optional[str] = None
    dept: Optional[str] = None


class EmployeeOut(EmployeeCreate):
    id: int
    class Config:
        from_attributes = True


class RecordCreate(BaseModel):
    month: str
    assiduite: float
    velocite: float
    qualite: float
    delais: float


class RecordOut(RecordCreate):
    id: int
    score: float
    class Config:
        from_attributes = True


class PredictionOut(BaseModel):
    employee_id: int
    current_score: float
    predicted_score: float
    alert: bool
    reasons: List[str]