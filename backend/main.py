import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager

from .database import init_db
from .routes.patient_routes import router as patient_router
from .routes.queue_routes import router as queue_router
from .routes.surge_routes import router as surge_router
from .routes.audit_routes import router as audit_router
from .routes.triage_routes import router as triage_router
from .routes.simulation_routes import router as simulation_router
from .routes.action_routes import router as action_router
from .routes.preorder_routes import router as preorder_router
from .routes.portal_routes import router as portal_router
from .routes.ems_routes import router as ems_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB and seed 20 benchmark patients
    init_db(seed_if_empty=True)
    yield
    # Shutdown logic if needed

app = FastAPI(
    title="PatientTriage.ai API",
    description="Active Autonomous ED Safety Control Tower — Decide First. Watch Continuously. Act in Time.",
    version="2.1.0",
    lifespan=lifespan
)

# Enable CORS for React frontend (Vite running on localhost:5173 or other ports)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(patient_router)
app.include_router(queue_router)
app.include_router(surge_router)
app.include_router(audit_router)
app.include_router(triage_router)
app.include_router(simulation_router)
app.include_router(action_router)
app.include_router(preorder_router)
app.include_router(portal_router)
app.include_router(ems_router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "PatientTriage.ai Intelligence Backend",
        "version": "2.0.0",
        "regulatory_mode": "Synthetic Demo / Research Prototype (HIPAA / GDPR Aligned)"
    }

# Mount static frontend if dist exists (Production on Render / unified deployment)
frontend_dist = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")

if os.path.exists(frontend_dist):
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = os.path.join(frontend_dist, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))

