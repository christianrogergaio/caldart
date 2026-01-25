
import sys
import os
import json

# Fix path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from services.api.main import app
from fastapi.testclient import TestClient

def check_prediction():
    print("\nChecking API /api/previsao ...")
    client = TestClient(app)
    try:
        resp = client.get("/api/previsao")
        print(f"Status: {resp.status_code}")
        if resp.status_code == 200:
            data = resp.json()
            print("Response:", json.dumps(data, indent=2, ensure_ascii=False))
            
            if "tendencia" in data and "risco" in data:
                print("SUCCESS: Endpoint returned valid prediction structure.")
            else:
                 print("FAILURE: Missing keys in response.")
        else:
            print("API failed.")
    except Exception as e:
        print(f"API Error: {e}")

if __name__ == "__main__":
    check_prediction()
