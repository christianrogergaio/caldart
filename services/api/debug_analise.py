
import sys
import os
from fastapi.testclient import TestClient

# Fix path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from services.api.main import app

def debug_analise_page():
    print("\nRequesting /analise to capture 500 error details...")
    client = TestClient(app)
    try:
        resp = client.get("/analise")
        print(f"Status Code: {resp.status_code}")
        if resp.status_code != 200:
            print("Response Content (Error):")
            print(resp.text)
        else:
            print("Success! Page rendered.")
    except Exception as e:
        print("EXCEPTION CAUGHT DIRECTLY:")
        print(e)
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug_analise_page()
