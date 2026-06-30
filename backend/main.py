from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import employees

app = FastAPI(title = "Meridian API")
app.add_middleware( # port cross connection
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],

)

app.include_router(employees.router)

@app.get("/")
def root():
    return {"message": "status - Meridian API: ON"}