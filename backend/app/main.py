from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
import os, json

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React's default development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Log(BaseModel):
    date: str = datetime.today().strftime('%Y-%m-%d')
    completed_tasks: list[str]
    notes: str | None = None

LOG_DIR = "app/logs"
os.makedirs(LOG_DIR, exist_ok=True)

@app.post("/log")
def submit_log(log: Log):
    file_path = os.path.join(LOG_DIR, f"log_{log.date}.json")
    with open(file_path, "w") as f:
        json.dump(log.dict(), f, indent=2)
    return {"status": "saved", "filename": f"log_{log.date}.json"}

@app.get("/logs")
def get_all_logs():
    logs = []
    for filename in os.listdir(LOG_DIR):
        if filename.endswith(".json"):
            with open(os.path.join(LOG_DIR, filename)) as f:
                logs.append(json.load(f))
    return {"logs": logs}
