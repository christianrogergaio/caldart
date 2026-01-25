from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import os
import sys

# Add project root to sys.path to allow importing core
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from core import config

app = FastAPI(title="AgroMonitor API", version="2.0")

# Mount Static Files
static_path = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(static_path):
    os.makedirs(static_path)
app.mount("/static", StaticFiles(directory=static_path), name="static")

# Templates
templates_path = os.path.join(os.path.dirname(__file__), "templates")
if not os.path.exists(templates_path):
    os.makedirs(templates_path)
templates = Jinja2Templates(directory=templates_path)

try:
    from .routes import readings, frontend
except ImportError:
    # Direct script execution
    from services.api.routes import readings, frontend
app.include_router(readings.router, prefix="/api")
app.include_router(frontend.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "api"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
