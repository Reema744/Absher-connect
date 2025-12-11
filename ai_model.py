# ai_model.py
# Core AI logic for Absher Connect Smart Suggestions.
# - Trains a document-based ML model (RandomForest).
# - Applies a rule-based check for King Fahd Causeway location.
# - Builds a unified list of suggestions for the frontend.

from pathlib import Path
from typing import List, Dict, Optional, Tuple
from math import radians, sin, cos, asin, sqrt

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline


# ---------------------------------------------------------------------------
# Dataset and feature configuration
# ---------------------------------------------------------------------------

# Path to the synthetic dataset used to train the ML model.
DATA_PATH = Path("data/absher_documents_synthetic.csv")

# Features used as inputs to the ML model.
CATEGORICAL_FEATURES = ["document_type", "document_importance", "has_late_renewal_before"]
NUMERIC_FEATURES = ["days_to_expiry"]

# Global cached model instance (lazy-loaded).
_model: Optional[Pipeline] = None


# ---------------------------------------------------------------------------
# Document-based ML model (RandomForest + preprocessing pipeline)
# ---------------------------------------------------------------------------

def train_model() -> Pipeline:
    """
    Train the RandomForest notification model on the synthetic dataset.

    The model predicts whether we should notify the user now about a document,
    based on its type, importance, expiry window, and user history.
    """
    global _model

    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found at {DATA_PATH}. "
            f"Run generate_dataset.py first to create it."
        )

    # Load dataset: each row represents a document instance.
    df = pd.read_csv(DATA_PATH)

    # Features (X) and target (y).
    X = df[CATEGORICAL_FEATURES + NUMERIC_FEATURES]
    y = df["notify_now"]  # 0/1: show smart card or not

    # Preprocessor: encode categorical features, keep numeric as-is.
    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL_FEATURES),
            ("num", "passthrough", NUMERIC_FEATURES),
        ]
    )

    # Core ML model.
    rf = RandomForestClassifier(
        n_estimators=200,
        random_state=42,
        class_weight="balanced",  # handle potential class imbalance
    )

    # Full pipeline: preprocessing + model.
    model = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("model", rf),
        ]
    )

    # Train/test split for quick validation.
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y,
    )

    # Train the model.
    model.fit(X_train, y_train)

    # Optional: simple accuracy for developers during training.
    accuracy = model.score(X_test, y_test)
    print(f"[AI MODEL] Notification model trained. Test accuracy: {accuracy:.3f}")

    _model = model
    return _model


def get_model() -> Pipeline:
    """
    Return a trained model instance.
    If not trained yet, train it first (lazy initialization).
    """
    global _model

    if _model is None:
        _model = train_model()

    return _model


def predict_notify(documents: List[Dict]) -> List[int]:
    """
    Predict whether we should send a notification for each document.

    Each document dict MUST contain:
      - document_type (str)
      - document_importance (str)
      - has_late_renewal_before (str)
      - days_to_expiry (int)

    Returns:
        List[int]: 0 = no smart card, 1 = show smart card.
    """
    model = get_model()

    # Convert input to DataFrame and keep only the expected features.
    df = pd.DataFrame(documents)
    df = df[CATEGORICAL_FEATURES + NUMERIC_FEATURES]

    preds = model.predict(df)
    return preds.tolist()


# ---------------------------------------------------------------------------
# Location-based rule: King Fahd Causeway smart suggestion
# ---------------------------------------------------------------------------

# Approximate coordinates for the Saudi side of King Fahd Causeway.
KING_FAHD_CAUSEWAY_LOCATION: Tuple[float, float] = (26.2285, 50.2163)

# Maximum distance (km) to trigger the location-based suggestion.
CAUSEWAY_MAX_DISTANCE_KM: float = 10.0


def _haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Compute the distance in kilometers between two GPS points
    using the haversine formula (great-circle distance).
    """
    # Convert degrees to radians.
    lat1_r, lon1_r, lat2_r, lon2_r = map(radians, [lat1, lon1, lat2, lon2])

    dlat = lat2_r - lat1_r
    dlon = lon2_r - lon1_r

    a = sin(dlat / 2.0) ** 2 + cos(lat1_r) * cos(lat2_r) * sin(dlon / 2.0) ** 2
    c = 2 * asin(sqrt(a))

    # Radius of Earth in kilometers.
    R = 6371.0
    return R * c


def should_notify_causeway(user_lat: float, user_lon: float) -> bool:
    """
    Check if the user is close enough to King Fahd Causeway.

    Returns True if the distance between the user and the causeway
    is within CAUSEWAY_MAX_DISTANCE_KM.
    """
    causeway_lat, causeway_lon = KING_FAHD_CAUSEWAY_LOCATION
    distance = _haversine_distance_km(user_lat, user_lon, causeway_lat, causeway_lon)
    return distance <= CAUSEWAY_MAX_DISTANCE_KM


# ---------------------------------------------------------------------------
# Unified suggestions builder (ML + location rule)
# ---------------------------------------------------------------------------

def build_suggestions(
    documents: List[Dict],
    user_lat: Optional[float] = None,
    user_lon: Optional[float] = None,
) -> Dict[str, List[Dict]]:
    """
    Build a unified list of smart suggestions.

    Combines:
      - ML-based document suggestions (RandomForest).
      - Optional location-based suggestion for King Fahd Causeway.

    Args:
        documents:
            List of documents, each like:
            {
              "document_type": "passport",
              "document_importance": "high",
              "has_late_renewal_before": "no",
              "days_to_expiry": 5
            }
        user_lat, user_lon:
            Current user GPS coordinates (optional).
            If not provided, no location suggestion is added.

    Returns:
        {
          "suggestions": [
            { ... document suggestion ... },
            { ... optional location suggestion ... }
          ]
        }
    """
    suggestions: List[Dict] = []

    # 1) ML-based document suggestions.
    if documents:
        doc_preds = predict_notify(documents)

        for doc, pred in zip(documents, doc_preds):
            if pred == 1:
                # Human-readable message for the card.
                msg = (
                    f"{doc['document_type']} expires in "
                    f"{doc['days_to_expiry']} days"
                )
                suggestions.append(
                    {
                        "type": "document",
                        "document_type": doc["document_type"],
                        "days_to_expiry": doc["days_to_expiry"],
                        "message": msg,
                    }
                )

    # 2) Optional location suggestion (only for King Fahd Causeway).
    if user_lat is not None and user_lon is not None:
        if should_notify_causeway(user_lat, user_lon):
            suggestions.append(
                {
                    "type": "location",
                    "location_type": "king_fahd_causeway",
                    "message": (
                        "You are near King Fahd Causeway. "
                        "You can pay border/customs fees for your vehicle now."
                    ),
                }
            )

    return {"suggestions": suggestions}
