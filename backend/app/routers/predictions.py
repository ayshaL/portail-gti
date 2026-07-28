"""
POST /predictions/{usr_matricule} -> forecast next month's score for one
employee, using the trained model in app/ml/trained_model.pkl.
"""

import pandas as pd
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.ml.inference import MIN_HISTORY, predict_for_employee
from app.models.tables import ProcessedResult
from app.models.schemas import PredictionResponse

router = APIRouter(
    prefix="/predictions",
    tags=["predictions"],
)


@router.get("/{usr_matricule}", response_model=PredictionResponse)
def generate_prediction(usr_matricule: str, db: Session = Depends(get_db)):
    """
    1. Pull the employee's full history from the database.
    2. Convert it to a DataFrame with the column names the ML code expects.
    3. Hand it to predict_for_employee(), which builds features the same
       way training did and runs the model.
    4. Return the forecast.
    """
    if usr_matricule.startswith("EMP-"):
        usr_matricule = usr_matricule.replace("EMP-", "")

    if usr_matricule.startswith("EMP-EMP-"):
            usr_matricule = usr_matricule.replace("EMP-EMP-", "")

    try:
        usr_matricule = int(usr_matricule)
    except ValueError:
        raise HTTPException(status_code=422, detail="Employee id must be numeric or in EMP-<digits> format")
    rows = (
        db.query(ProcessedResult)
        .filter(ProcessedResult.usr_matricule == usr_matricule)
        .order_by(ProcessedResult.period.asc())
        .all()
    )
    if not rows:
        raise HTTPException(status_code=404, detail="Employee not found")

    if len(rows) < MIN_HISTORY:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Not enough history to predict: need {MIN_HISTORY} months, "
                f"employee has {len(rows)}"
            ),
        )

    # The ML code (feat_engineering.py, predict.py) was written against
    # uppercase column names matching the original CSV, so we rebuild that
    # shape here rather than changing the ML code to match the database.
    hist_df = pd.DataFrame([
        {
            "PERIOD": r.period,
            "ASSIDUITE": r.assiduite,
            "PROD": r.prod,
            "QUAL": r.qual,
            "DEPASS": r.depass,
            "SCORE": r.score,
        }
        for r in rows
    ])

    # If a column (e.g. QUAL, DEPASS) is empty (all None) for every row in
    # this window, pandas leaves it as a generic "object" column instead of
    # numeric -- which breaks numpy's isnan() inside feat_engineering.py.
    # Forcing these to numeric turns "None" into a proper NaN float.
    numeric_cols = ["ASSIDUITE", "PROD", "QUAL", "DEPASS", "SCORE"]
    hist_df[numeric_cols] = hist_df[numeric_cols].apply(pd.to_numeric, errors="coerce")

    result = predict_for_employee(hist_df)

    return PredictionResponse(
        usr_matricule=usr_matricule,
        current_score=float(rows[-1].score),
        predicted_score=result["predicted_score"],
        alert=result["alert"],
        reasons=result["reasons"],
    )