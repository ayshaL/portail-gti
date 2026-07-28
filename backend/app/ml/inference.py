"""
Bridges your database rows to the ML model.

Your model was trained on rolling 3-month windows: it looks at 3 past
months of an employee's numbers and learns to predict what the 4th
month's SCORE will be. This file rebuilds that same shape of features
at prediction time, using an employee's most recent 3 months from the
live database, then hands it to predict.py.
"""

import pandas as pd

from app.ml.feat_engineering import make_features
from app.ml.predict import predict_next_score

# The model needs 3 past months to compute trends/lags -- fewer than
# that and there isn't enough history to build the same features it
# was trained on.
MIN_HISTORY = 3


def build_inference_features(hist_df: pd.DataFrame) -> dict:
    """
    hist_df: the most recent 3 rows for ONE employee, sorted oldest -> newest,
    with columns PERIOD, ASSIDUITE, PROD, QUAL, DEPASS, SCORE.

    Returns a dict with the exact keys train_model.py's FEATURES list expects
    (e.g. "PROD_lag_1", "score_trend", "assiduite_mean", ...).
    """
    # make_features() (from feat_engineering.py) computes mean/std/trend/etc.
    # over the 3 rows -- we reuse it as-is, it's already generic.
    stats = make_features(hist_df)

    def lag(col, n):
        # lag_1 = most recent month, lag_2 = the one before, lag_3 = oldest of the 3
        return float(hist_df.iloc[-n][col])

    return {
        "PROD_lag_1": lag("PROD", 1),
        "PROD_lag_2": lag("PROD", 2),
        "PROD_lag_3": lag("PROD", 3),
        "QUAL_lag_1": lag("QUAL", 1),
        "QUAL_lag_2": lag("QUAL", 2),
        "QUAL_lag_3": lag("QUAL", 3),
        "SCORE_lag_1": lag("SCORE", 1),
        "SCORE_lag_2": lag("SCORE", 2),
        "SCORE_lag_3": lag("SCORE", 3),
        "prod_std": stats["prod_std"],
        "prod_trend": stats["prod_trend"],
        "qual_std": stats["qual_std"],
        "qual_trend": stats["qual_trend"],
        "score_std": stats["score_std"],
        "score_trend": stats["score_trend"],
        "assiduite_mean": stats["assiduite_mean"],
        "depass_mean": stats["depass_mean"],
    }


def predict_for_employee(hist_df: pd.DataFrame) -> dict:
    """
    hist_df: an employee's FULL history, sorted oldest -> newest.
    Uses only the most recent MIN_HISTORY rows to forecast next month.

    Returns the dict from predict_next_score():
      {"predicted_score": ..., "alert": ..., "reasons": [...]}
    """
    if len(hist_df) < MIN_HISTORY:
        raise ValueError(
            f"Need at least {MIN_HISTORY} months of history, got {len(hist_df)}"
        )

    recent = hist_df.tail(MIN_HISTORY).reset_index(drop=True)
    current_score = float(recent.iloc[-1]["SCORE"])
    feature_dict = build_inference_features(recent)

    return predict_next_score(current_score, feature_dict)