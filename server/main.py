"""
Back to the Moon! - Game Server
"""
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Back to the Moon!", version="0.1.0")

# CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "game": "Back to the Moon!"}

@app.get("/api/highscores")
async def get_highscores():
    """Get top scores for all stages"""
    # TODO: Implement database storage
    return {
        "stage1": [],
        "stage2": [],
        "stage3": []
    }

@app.post("/api/highscores/{stage}")
async def submit_score(stage: str, score: int, player: str):
    """Submit a new high score"""
    # TODO: Implement score submission
    return {"submitted": True}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
