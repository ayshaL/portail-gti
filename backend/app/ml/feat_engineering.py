import numpy as np
import pandas as pd

def _valid_values(values):
    valid = values[~np.isnan(values)]
    return valid if len(valid) else np.array([])


def _safe_mean(values):
    valid = _valid_values(values)
    return float(valid.mean()) if len(valid) else 0.0


def _safe_std(values):
    valid = _valid_values(values)
    return float(valid.std()) if len(valid) > 1 else 0.0


def _safe_last(values):
    valid = _valid_values(values)
    return float(valid[-1]) if len(valid) else 0.0


def _safe_first(values):
    valid = _valid_values(values)
    return float(valid[0]) if len(valid) else 0.0


def _safe_trend(values):
    valid = _valid_values(values)
    if len(valid) < 2:
        return 0.0
    x = np.arange(len(valid))
    return float(np.polyfit(x, valid, 1)[0])


def _safe_change(values):
    valid = _valid_values(values)
    if len(valid) < 2:
        return 0.0
    return float(valid[-1] - valid[0])


def _missing_count(values):
    return int(np.isnan(values).sum())

def make_features(hist):
    """hist: DataFrame of one employee's rows, sorted by period, length 1-6."""
    metrics = {
        "score": hist["SCORE"].values,
        "assiduite": hist["ASSIDUITE"].values,
        "prod": hist["PROD"].values,
        "qual": hist["QUAL"].values,
        "depass": hist["DEPASS"].values,
    }

    feats = {}
    for prefix, values in metrics.items():
        feats[f"{prefix}_mean"] = _safe_mean(values)
        feats[f"{prefix}_std"] = _safe_std(values)
        feats[f"{prefix}_last"] = _safe_last(values)
        feats[f"{prefix}_trend"] = _safe_trend(values)
        feats[f"{prefix}_change"] = _safe_change(values)
        feats[f"{prefix}_missing_count"] = _missing_count(values)

    return feats


def gen_feat(df):
    kpis = [
        'ASSIDUITE',
        'PROD',
        'QUAL',
        'DEPASS',
        'SCORE'
    ]

    df = df.sort_values(
        ['USR_MATRICULE', 'PERIOD']
    ).reset_index(drop=True)

    for col in kpis:
        for lag in range(1,4):
            df[f'{col}_lag_{lag}'] = (
                df.groupby('USR_MATRICULE')[col]
                .shift(lag)
            )
    df = df.dropna(subset=['SCORE_lag_3'])

    # save the processed dataset
    # df.to_csv(ENGINEERED_DATA_PATH, index=False)

    return df


def build_features(df):
    window = 3
    rows = []

    for uid, g in df.groupby("USR_MATRICULE"):
        g = g.sort_values("PERIOD").reset_index(drop=True)

        # slide over each employee
        for start in range(len(g) - window):
            hist = g.iloc[start:start+window]
            target = g.iloc[start+window]

            features = make_features(hist)

            features["USR_MATRICULE"] = uid
            features["target_SCORE"] = target["SCORE"]
            features["target_PERIOD"] = target["PERIOD"]

            rows.append(features)

    data = pd.DataFrame(rows)

    print(data.shape)

    # Merge the generated features (from 'data') into the existing 'df'
    # The 'target_period' in 'data' aligns with the 'PERIOD' in 'df' for the prediction
    df = pd.merge(df, data, left_on=['USR_MATRICULE', 'PERIOD'], right_on=['USR_MATRICULE', 'target_PERIOD'], how='left')

    # Drop the redundant 'target_period' column after merging, as it's now aligned with 'PERIOD'
    df = df.drop(columns=['target_PERIOD', 'target_SCORE'])

    df = gen_feat(df)  # Generate lag features for the merged DataFrame

    return df
