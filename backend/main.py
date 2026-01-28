from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.api.endpoints import router as api_router # Importamos el router

# Crear tablas en la DB al iniciar
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Cidenet Employee Management API",
    version="1.0.0"
)

# Configuración de CORS para React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar las rutas de la API
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "API de Cidenet operativa", "docs": "/docs"}