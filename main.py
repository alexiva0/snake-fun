from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

api = FastAPI(title="api")

HIGH_SCORE = 0


class HighScore(BaseModel):
    high_score: int


@api.get("/score/", response_model=HighScore)
async def get_high_score():
    return {"high_score": HIGH_SCORE}


@api.post("/score/", status_code=201)
async def set_high_score(body: HighScore):
    global HIGH_SCORE
    HIGH_SCORE = body.high_score
    return body


app = FastAPI(title="main")

app.mount("/api", api)
app.mount("/", StaticFiles(directory="static", html=True), name="static")
