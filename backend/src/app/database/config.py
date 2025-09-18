# Configuracion y conexion a la base de datos PostgreSQL usando SQLAlchemy

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.parameters import settings

debug = settings.DEBUG

DATABASE_URL = settings.SUPABASE_URL_TEST if debug else settings.SUPABASE_URL

engine = create_engine(
    DATABASE_URL,
    # SSL requerido por Supabase; añadir keepalives para evitar caídas por inactividad
    connect_args={
        "sslmode": "require",
        # TCP keepalive settings (psycopg2)
        "keepalives": 1,
        "keepalives_idle": 30,
        "keepalives_interval": 10,
        "keepalives_count": 5,
    },
    pool_pre_ping=True,        # Verifica la conexión antes de usarla
    pool_recycle=300,          # Recicla conexiones cada 5 min para evitar timeouts del pooler
    pool_size=5,               # Tamaño base del pool
    max_overflow=10,           # Conexiones extra permitidas sobre pool_size
    pool_timeout=30,           # Tiempo máximo esperando una conexión libre
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

