import os
import jwt
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import Column, Integer, String, Float, update, ForeignKey
from sqlalchemy.future import select

app = FastAPI(title="Motor CRM API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

DATABASE_URL = f"postgresql+asyncpg://{DB_USER}:{DB_PASS}@{POSTGRES_HOST}:5432/{DB_NAME}"
engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

class Company(Base):
    __tablename__ = 'Company_company'
    id = Column(Integer, primary_key=True)
    nameCompany = Column(String, unique=True)

class Person(Base):
    __tablename__ = 'Company_person'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    lastname = Column(String)
    email = Column(String, unique=True)

class Seller(Base):
    __tablename__ = 'Company_seller'
    id = Column(Integer, primary_key=True)
    badge = Column(String, unique=True)
    performance = Column(Float, default=0.0)
    commission = Column(Float, default=0.05)
    person_id = Column(Integer, ForeignKey('Company_person.id')) 
    company_id = Column(Integer, ForeignKey('Company_company.id'))

class Lead(Base):
    __tablename__ = 'Company_lead'
    id = Column(Integer, primary_key=True)
    butget = Column(Float, default=0.0)
    status = Column(String)
    priority = Column(String)
    person_id = Column(Integer, ForeignKey('Company_person.id'))
    company_id = Column(Integer, ForeignKey('Company_company.id'))
    seller_id = Column(Integer, ForeignKey('Company_seller.id'), nullable=True)
    
class UpdateLeadRequest(BaseModel):
    new_status: str | None = None
    new_company: int | None = None
    new_seller: int | None = None

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

@app.patch("/api/leads/move/{lead_id}")
async def move_lead(
    lead_id: int,
    movimiento: UpdateLeadRequest,
    db: AsyncSession = Depends(get_db),
):
    update_data = {}
    if movimiento.new_status:
        update_data['status'] = movimiento.new_status
    if movimiento.new_company:
        update_data['company_id'] = movimiento.new_company
    if movimiento.new_seller is not None:
        update_data['seller_id'] = movimiento.new_seller
    if not update_data:
        raise HTTPException(status_code=400, detail="No hay datos para actualizar")
    query = update(Lead).where(Lead.id == lead_id).values(**update_data)
    result = await db.execute(query)
    await db.commit()
    
    return {"message": "Lead movido exitosamente"}