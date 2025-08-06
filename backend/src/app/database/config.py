# Configuracion y conexion a la base de datos PostgreSQL usando SQLAlchemy

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


DATABASE_URL = "postgresql://postgres.xlofuwhnkksvfvxofump:isuperrubick69@aws-0-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require"

engine = create_engine(
    DATABASE_URL,
    connect_args={"sslmode": "require"},
    pool_pre_ping=True
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

