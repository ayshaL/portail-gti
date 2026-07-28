from sqlalchemy import Boolean, Column, Date, Float, Integer
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class ProcessedResult(Base):
    __tablename__ = "processed_results"

    id = Column(Integer, primary_key=True, autoincrement=True)
    period = Column(Date, nullable=False, index=True)
    usr_matricule = Column(Integer, nullable=False, index=True)
    assiduite = Column(Float, nullable=True)
    prod = Column(Float, nullable=True)
    qual = Column(Float, nullable=True)
    depass = Column(Float, nullable=True)
    score = Column(Float, nullable=True)
    generated = Column(Boolean, nullable=False)

    def __repr__(self):
        return (
            f"<ProcessedResult(id={self.id}, period={self.period}, "
            f"usr_matricule={self.usr_matricule}, score={self.score})>"
        )