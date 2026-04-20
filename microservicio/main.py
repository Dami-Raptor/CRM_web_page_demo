import os
import jwt
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import Column, Integer, String, Float, update
from sqlalchemy.future import select

app = FastAPI(title="Motor CRM API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica los dominios
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

DB_USER = os.environ.get('POSTGRES_USER', 'admin')
DB_PASS = os.environ.get('POSTGRES_PASSWORD', 'super')
DB_NAME = os.environ.get('POSTGRES_DB', 'company_db')
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'tu_secreto')
POSTGRES_HOST = os.environ.get('POSTGRES_HOST', None)

# Construcción de la URL
DATABASE_URL = f"postgresql+asyncpg://{DB_USER}:{DB_PASS}@{POSTGRES_HOST}:5432/{DB_NAME}"
engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

class Lead(Base):
    __tablename__ = 'Company_lead'
    id = Column(Integer, primary_key=True, index=True)
    badge = Column(String, unique=True)
    status = Column(String, default='Prospecto')

class UpdateLeadRequest(BaseModel):
    new_status: str

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

def verify_jwt(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
@app.get("/")
async def root():
    return {"message": "CRM API is running", "status": "healthy"}

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.patch("/api/leads/move/{lead_id}")
async def move_lead(
    lead_id: int,
    movimiento: UpdateLeadRequest,
    db: AsyncSession = Depends(get_db),
    user_validation: dict = Depends(verify_jwt)
):
    estatus_permitidos = ['Prospecto', 'Cliente']
    
    if movimiento.new_status not in estatus_permitidos:
        raise HTTPException(status_code=400, detail="Estatus no permitido")
    
    query = (
        update(Lead)
        .where(Lead.id == lead_id)
        .values(status=movimiento.new_status)
    )
    result = await db.execute(query)
    await db.commit()
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail='Lead no encontrado')
    return {"message": "Lead actualizado correctamente"}

@app.on_event("startup")
async def startup():
    """Verificar conexión a la base de datos al iniciar"""
    try:
        async with engine.connect() as conn:
            await conn.execute(select(1))
        print(" Conexión a la base de datos exitosa")
    except Exception as e:
        print(f"Error de conexión a la base de datos: {e}")