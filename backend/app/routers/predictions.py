from pathlib import Path
import pandas as pd
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.ml.feat_engineering import build_features
from app.ml.predict import predict_next_score
from app.models.schemas import Employee, MonthlyRecord, PredictionOut

router = APIRouter(prefix="/predictions", tags=["predictions"])

HIST_PATH = Path(__file__).resolve().parents[2] / "data" / "processed_results.csv"

@router.get("/{employee_id}", response_model=PredictionOut)
def get_prediction(employee_id: int, db: Session = Depends(get_db)):
    emp = db.query(Employee).get(employee_id)
    if not emp:
        raise HTTPException(404, "Collaborateur introuvable")

    records = (
        db.query(MonthlyRecord)
        .filter(MonthlyRecord.employee_id == employee_id)
        .order_by(MonthlyRecord.month.desc())
        .limit(3)
        .all()
    )
    if len(records) < 3:
        raise HTTPException(400, "Historique insuffisant (3 mois requis) pour une prédiction")

    records = list(reversed(records))  # du plus ancien au plus récent
    history = pd.read_csv(HIST_PATH)

    feature_dict = build_features(history)
    current_score = records[-1].score
    result = predict_next_score(current_score, feature_dict)

    return PredictionOut(
        employee_id=employee_id,
        current_score=current_score,
        predicted_score=result["predicted_score"],
        alert=result["alert"],
        reasons=result["reasons"],
    )