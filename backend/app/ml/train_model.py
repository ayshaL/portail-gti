import pandas as pd
import joblib
from pathlib import Path
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import GroupShuffleSplit
from sklearn.metrics import root_mean_squared_error, r2_score
from sklearn.metrics import mean_absolute_error

DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "collab_data.csv"
MODEL_PATH = Path(__file__).resolve().parent / "trained_model.pkl"

EMPLOYEE_ID_COL = "USR_MATRICULE"

FEATURES = [
    'PROD_lag_1', 'PROD_lag_2', 'PROD_lag_3',
    'QUAL_lag_1', 'QUAL_lag_2', 'QUAL_lag_3',
    'SCORE_lag_1', 'SCORE_lag_2', 'SCORE_lag_3',
    'prod_std', 'prod_trend', 'qual_std', 'qual_trend', 'score_std', 'score_trend',
    'assiduite_mean', 'depass_mean'

]

TARGET = "SCORE"

pipeline = Pipeline([
    (
        "imputer", SimpleImputer(strategy="median")
    ),
    (
        "model",
        RandomForestRegressor(
            n_estimators=200,
            max_depth=3,
            min_samples_leaf=6,
            max_features=0.7,
            random_state=42,
        ),
    )
])

def train():
    df = pd.read_csv(DATA_PATH)

    X = df[FEATURES]
    y = df[TARGET]
    groups = df[EMPLOYEE_ID_COL]

    gss = GroupShuffleSplit(
        n_splits=1,
        test_size=0.3,
        random_state=42,
    )

    train_idx, test_idx = next(
        gss.split(X, y, groups=groups)
    )

    X_train = X.iloc[train_idx]
    X_test = X.iloc[test_idx]

    y_train = y.iloc[train_idx]
    y_test = y.iloc[test_idx]

    pipeline.fit(X_train, y_train)

    preds = pipeline.predict(X_test)

    mae = mean_absolute_error(y_test, preds)
    rmse = root_mean_squared_error(y_test, preds)
    r2 = r2_score(y_test, preds)

    print(f"MAE :  {mae:.2f}")
    print(f"RMSE:  {rmse:.2f}")
    print(f"R²  :  {r2:.3f}")

    joblib.dump({"model": pipeline, "features": FEATURES}, MODEL_PATH)
    print(f"Model saved dans {MODEL_PATH}")

if __name__ == "__main__":
    train()