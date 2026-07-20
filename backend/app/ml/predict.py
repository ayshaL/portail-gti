import joblib
import pandas as pd
from pathlib import Path

MODEL_PATH = Path(__file__).resolve().parent / "trained_model.pkl"

bundle = joblib.load(MODEL_PATH)
pipeline = bundle["model"]
features = bundle["features"]

# The prediction is for the next period, so this delta represents the
# forecasted variation in points per month.
ALERT_THRESHOLD = -3

REASON_LABELS = {
    "critical_decline": "🔴 Baisse critique (< -3 pts/mois) — Intervention urgente (< 48 h)",
    "significant_decline": "🟠 Baisse significative (-3 à -1,5 pts/mois) — Surveillance rapprochée",
    "moderate_decline": "🟠 Baisse modérée (-1,5 à -0,5 pts/mois) — Attention recommandée",
    "stable": "🟠 Stable (-0,5 à +0,5 pts/mois) — Performance maintenue",
    "progression": "📈 Progression (> +0,5 pts/mois) — Valoriser / missions stratégiques",
}


def trend_status(monthly_delta: float) -> str:
    """Classify the forecasted score variation into an HR action level."""
    if monthly_delta < -3:
        return "critical_decline"
    if monthly_delta < -1.5:
        return "significant_decline"
    if monthly_delta < -0.5:
        return "moderate_decline"
    if monthly_delta <= 0.5:
        return "stable"
    return "progression"


def predict_next_score(current_score: float, feature_dict: dict) -> dict:
    X = pd.DataFrame([feature_dict])[features]
    predicted = round(float(pipeline.predict(X)[0]), 1)

    delta = predicted - current_score
    status = trend_status(delta)
    alert = delta < ALERT_THRESHOLD
    reasons = [REASON_LABELS[status]]

    return {"predicted_score": predicted, "alert": alert, "reasons": reasons}
