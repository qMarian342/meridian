from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import employees
from routers import checklist
from routers import schedule
from routers import auth
from routers import hr
from routers import departments

app = FastAPI(title = "Meridian API")
app.add_middleware( # port cross connection
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],

)

app.include_router(auth.router)
app.include_router(employees.router)
app.include_router(checklist.router)
app.include_router(schedule.router)
app.include_router(hr.router)
app.include_router(departments.router)

@app.get("/")
def root():
    return {"message": "status - Meridian API: ON"}