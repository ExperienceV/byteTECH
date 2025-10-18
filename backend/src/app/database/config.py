# Configuracion y conexion a la base de datos PostgreSQL usando SQLAlchemy

import logging
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import DisconnectionError, OperationalError
from sqlalchemy.pool import QueuePool
from app.parameters import settings
import time

logger = logging.getLogger(__name__)

debug = settings.DEBUG

DATABASE_URL = settings.SUPABASE_URL_TEST if debug else settings.SUPABASE_URL

# Enhanced connection arguments for Supabase SSL stability after stress tests
connect_args = {
    "sslmode": "require",
    "sslcert": None,
    "sslkey": None,
    "sslrootcert": None,
    "sslcrl": None,
    "application_name": "byteTECH_backend_v2",
    # More conservative TCP keepalive settings for post-stress recovery
    "keepalives": 1,
    "keepalives_idle": 300,      # 5 minutes - more frequent checks
    "keepalives_interval": 15,   # 15 seconds - faster detection
    "keepalives_count": 5,       # More retries
    # More conservative connection timeout settings
    "connect_timeout": 15,       # Longer initial timeout
    "options": "-c statement_timeout=45000 -c idle_in_transaction_session_timeout=300000",  # 45s statement, 5min idle timeout
    # Additional SSL stability options
    "gssencmode": "disable",     # Disable GSS encryption to reduce complexity
    "target_session_attrs": "read-write",  # Ensure we get a writable connection
}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    poolclass=QueuePool,
    pool_pre_ping=True,        # Verifica la conexión antes de usarla
    pool_recycle=900,          # More aggressive recycling (15 min) after stress test
    pool_size=5,               # Reduced pool size to avoid overwhelming Supabase
    max_overflow=10,           # Reduced overflow to be more conservative
    pool_timeout=45,           # Longer timeout for stressed connections
    pool_reset_on_return='commit',  # Reset connections on return
    echo=debug,                # Log SQL queries in debug mode
    # Additional engine options for SSL stability
    isolation_level="READ_COMMITTED",  # Explicit isolation level
    future=True,               # Use SQLAlchemy 2.0 style
)

# Add connection event listeners for better error handling
@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    """Set connection parameters on connect"""
    if hasattr(dbapi_connection, 'autocommit'):
        dbapi_connection.autocommit = False

@event.listens_for(engine, "checkout")
def receive_checkout(dbapi_connection, connection_record, connection_proxy):
    """Log when connections are checked out"""
    logger.debug(f"Connection checked out: {id(dbapi_connection)}")

@event.listens_for(engine, "checkin")
def receive_checkin(dbapi_connection, connection_record):
    """Log when connections are checked in"""
    logger.debug(f"Connection checked in: {id(dbapi_connection)}")

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

