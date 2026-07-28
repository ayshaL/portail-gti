"""
ORM model for the `employees` table -- the profile/HR-style data,
separate from `processed_results` (the performance scores).

Note: usr_matricule here is NOT a formal foreign key to
processed_results.usr_matricule, because that column isn't unique there
(one employee has many rows, one per month). The link between the two
tables is logical, not enforced by the database -- you're expected to
query them together using usr_matricule, as employees.py already does.
"""

from sqlalchemy import JSON, Column, Integer, String

from app.models.tables import Base


class Employee(Base):
    __tablename__ = "employees"

    usr_matricule = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    initials = Column(String, nullable=False)
    profil = Column(String, nullable=False)
    statut = Column(String, nullable=False)
    fonction = Column(String, nullable=False)
    groupe = Column(String, nullable=False)
    situation_contractuelle = Column(String, nullable=False)
    sup_hierarchique = Column(String, nullable=True)
    departement = Column(String, nullable=False)

    # SQLAlchemy's JSON type automatically converts a Python list/dict
    # to a JSON string when saving, and back to a list/dict when reading --
    # you never have to call json.dumps()/json.loads() yourself.
    competences = Column(JSON, nullable=False)  # e.g. ["Python", "Docker"]

    leave = Column(Integer, nullable=False)
    diploma = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    phone = Column(String, nullable=False)
    birthdate = Column(String, nullable=False)

    # e.g. {"gti": {...}, "academique": {...}}
    parcours = Column(JSON, nullable=False)

    def __repr__(self):
        return f"<Employee(usr_matricule={self.usr_matricule}, name={self.name!r})>"