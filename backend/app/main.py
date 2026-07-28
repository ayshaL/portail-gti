# claude generated (just to get an idea of the strcuture of the code)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import predictions, employees
from app.models import employee, tables

Base.metadata.create_all(bind=engine)

app = FastAPI(title="GPI Performance API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # URL du frontend Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employees.router)
app.include_router(predictions.router)

@app.get("/")
def root():
    """A simple health check — visit http://127.0.0.1:8000/ to confirm it's running."""
    return {"status": "GPI API en ligne"}
