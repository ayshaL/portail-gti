"""
This file describes the shape of data going IN and OUT of your API.

Difference from gpi.py: gpi.py describes the database table.
schemas.py describes the JSON your API sends/receives.
They usually look similar, but they serve different jobs — the ORM model
talks to the database, the schema talks to the outside world (your website).
"""

from datetime import date
from typing import List, Optional

from pydantic import BaseModel, ConfigDict


class ProcessedResultBase(BaseModel):
    """Fields shared by every variant below."""
    period: date
    usr_matricule: int
    assiduite: Optional[float] = None
    prod: Optional[float] = None
    qual: Optional[float] = None
    depass: Optional[float] = None
    score: Optional[float] = None
    generated: bool


class ProcessedResultCreate(ProcessedResultBase):
    """Used when someone POSTs a new row — no id, since the DB assigns it."""
    pass


class ProcessedResultUpdate(BaseModel):
    """Used for PATCH requests — every field optional, only send what changes."""
    period: Optional[date] = None
    usr_matricule: Optional[int] = None
    assiduite: Optional[float] = None
    prod: Optional[float] = None
    qual: Optional[float] = None
    depass: Optional[float] = None
    score: Optional[float] = None
    generated: Optional[bool] = None


class ProcessedResult(ProcessedResultBase):
    """Used when returning data to the client — includes the database id."""
    id: int

    # This lets Pydantic read straight from a SQLAlchemy object
    # (e.g. ProcessedResult.model_validate(db_row)) instead of a plain dict.
    model_config = ConfigDict(from_attributes=True)


class PredictionResponse(BaseModel):
    """What the /predictions endpoint returns."""
    usr_matricule: int
    current_score: float
    predicted_score: float
    alert: bool
    reasons: list[str]


# ---------------------------------------------------------------------------
# Employee profile schemas
# ---------------------------------------------------------------------------

class GtiParcours(BaseModel):
    """The 'gti' block inside parcours -- assignment/contract info."""
    situation: str
    projetAffecte: str
    datePriseDu: str
    datePriseAu: str
    dateDebutContratDu: str
    dateDebutContratAu: str


class AcademiqueParcours(BaseModel):
    """The 'academique' block inside parcours -- school/diploma info."""
    enAlternance: bool
    ecole: str
    diplome: str


class Parcours(BaseModel):
    """The full nested parcours object: {gti: {...}, academique: {...}}."""
    gti: GtiParcours
    academique: AcademiqueParcours


class EmployeeBase(BaseModel):
    name: str
    initials: str
    profil: str
    statut: str
    fonction: str
    groupe: str
    situation_contractuelle: str
    sup_hierarchique: Optional[str] = None
    departement: str
    competences: List[str]
    leave: int
    diploma: str
    email: str
    phone: str
    birthdate: str
    parcours: Parcours


class EmployeeCreate(EmployeeBase):
    """Fields required to create a new employee profile."""
    usr_matricule: int


class EmployeeUpdate(BaseModel):
    """All fields optional, for partial updates (PATCH)."""
    name: Optional[str] = None
    initials: Optional[str] = None
    profil: Optional[str] = None
    statut: Optional[str] = None
    fonction: Optional[str] = None
    groupe: Optional[str] = None
    situation_contractuelle: Optional[str] = None
    sup_hierarchique: Optional[str] = None
    departement: Optional[str] = None
    competences: Optional[List[str]] = None
    leave: Optional[int] = None
    diploma: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    birthdate: Optional[str] = None
    parcours: Optional[Parcours] = None


class Employee(EmployeeBase):
    """Full schema returned to clients."""
    usr_matricule: int

    model_config = ConfigDict(from_attributes=True)