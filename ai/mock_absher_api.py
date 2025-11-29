"""Modified API to fetch from our Node.js backend instead of mock data"""
import requests
import os
from datetime import datetime, timedelta

API_BASE_URL = os.getenv("ABSHER_API_URL", "http://localhost:5000")

def fetch_from_api(endpoint: str, user_id: int):
    """Helper to fetch from our Node.js API"""
    try:
        # Note: In production, you'd need to authenticate/use a service token
        url = f"{API_BASE_URL}{endpoint}"
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            return response.json()
        return None
    except Exception as e:
        print(f"Error fetching {endpoint}: {e}")
        return None

def get_user_documents(user_id: int):
    """Fetch user documents from our APIs"""
    documents = []
    
    # Fetch passport
    passport = fetch_from_api(f"/api/services/passport/{user_id}", user_id)
    if passport and passport.get("expiryDate"):
        days_to_expiry = (
            datetime.strptime(passport["expiryDate"], "%Y-%m-%d").date() - datetime.now().date()
        ).days
        documents.append({
            "document_type": "Passport",
            "expiry_date": passport["expiryDate"],
            "document_importance": "HIGH" if days_to_expiry <= 30 else "MEDIUM",
            "has_late_renewal_before": "YES" if days_to_expiry < 0 else "NO"
        })
    
    # Fetch national ID
    national_id = fetch_from_api(f"/api/services/national-id/{user_id}", user_id)
    if national_id and national_id.get("expiryDate"):
        days_to_expiry = (
            datetime.strptime(national_id["expiryDate"], "%Y-%m-%d").date() - datetime.now().date()
        ).days
        documents.append({
            "document_type": "National ID",
            "expiry_date": national_id["expiryDate"],
            "document_importance": "HIGH" if days_to_expiry <= 30 else "MEDIUM",
            "has_late_renewal_before": "YES" if days_to_expiry < 0 else "NO"
        })
    
    # Fetch driving license
    driving_license = fetch_from_api(f"/api/services/driving-license/{user_id}", user_id)
    if driving_license and driving_license.get("expiryDate"):
        days_to_expiry = (
            datetime.strptime(driving_license["expiryDate"], "%Y-%m-%d").date() - datetime.now().date()
        ).days
        documents.append({
            "document_type": "Driving License",
            "expiry_date": driving_license["expiryDate"],
            "document_importance": "HIGH" if days_to_expiry <= 30 else "MEDIUM",
            "has_late_renewal_before": "YES" if days_to_expiry < 0 else "NO"
        })
    
    return documents
