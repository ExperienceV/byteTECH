# Configuracion y conexion a la base de datos PostgreSQL usando SQLAlchemy

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

USER = "admin"
PASSWORD = "root"
HOST = "localhost"  
PORT = "5432"      
DB_NAME = "byteTECH"

DATABASE_URL = f"postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
