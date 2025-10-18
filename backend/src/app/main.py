from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.middlewares import TokenRefreshMiddleware
from app.parameters import settings
from app.logging_config import setup_logging
import logging

# Initialize logging
setup_logging()
logger = logging.getLogger(__name__)

app = FastAPI(
    title="ByteTech API",
    version=settings.VERSION,
    docs_url="/docs" if settings.DEBUG else None  # Desactiva docs en producción
)

logger.info(f"ByteTech API starting - Version: {settings.VERSION}, Debug: {settings.DEBUG}")

# -------- MiddlWeware Configuration --------

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ALLOW_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS,
    expose_headers=["*"],
    max_age=3600,
)

app.add_middleware(TokenRefreshMiddleware)

@app.get("/version")
async def get_version():
    version = settings.VERSION
    return version

# -------- Include Routers --------
from app.routers.auth import auth_router
from app.routers.courses import courses_router
from app.routers.forums import forums_router
from app.routers.media import media_router
from app.routers.workbrench import workbrench_router
from app.routers.support import support_router
from app.routers.user import user_router
from app.routers.stats import stats_router
from app.routers.health import health_router


router_list = [
    auth_router,
    courses_router,
    forums_router,
    media_router,
    workbrench_router, 
    support_router,
    user_router,
    stats_router,
    health_router
]

for router in router_list:
    app.include_router(router, prefix="/api")


# -------- Setup Database --------
from app.database.base import Base
from app.database.config import engine
from app.database.session import reset_connection_pool
from sqlalchemy.exc import OperationalError
import time

def initialize_database_with_retry(max_retries=3, delay=5.0):  # Reduced retries, longer delays
    """Initialize database with retry logic for SSL connection issues"""
    for attempt in range(max_retries):
        try:
            logger.info(f"Attempting database initialization (attempt {attempt + 1}/{max_retries})")
            
            # Reset connection pool before attempting
            if attempt > 0:
                logger.info("Resetting connection pool before retry")
                reset_connection_pool()
                time.sleep(delay * attempt)  # Exponential backoff
            
            # Try to create tables
            Base.metadata.create_all(bind=engine)
            logger.info("Database initialization successful")
            return True
            
        except OperationalError as e:
            error_msg = str(e).lower()
            if 'ssl connection has been closed' in error_msg or 'ssl' in error_msg:
                logger.warning(f"SSL connection error on attempt {attempt + 1}: {e}")
                if attempt < max_retries - 1:
                    wait_time = delay * (attempt + 1)
                    logger.info(f"⏳ Waiting {wait_time} seconds before retry (Supabase SSL protection active)...")
                    logger.info(f"💡 Tip: This usually resolves in 15-30 minutes after stress testing")
                    continue
                else:
                    logger.error("All database initialization attempts failed")
                    raise e
            else:
                # Non-SSL error, don't retry
                logger.error(f"Non-retryable database error: {e}")
                raise e
        except Exception as e:
            logger.error(f"Unexpected database initialization error: {e}")
            raise e
    
    return False

# Initialize database with retry logic - with graceful degradation
try:
    logger.info("Starting database initialization with extended retry logic...")
    initialize_database_with_retry()
except Exception as e:
    logger.error(f"Failed to initialize database after all retries: {e}")
    logger.warning("⚠️  SUPABASE SSL PROTECTION ACTIVE - Starting in degraded mode")
    logger.info("💡 App will start without DB initialization. Use /api/health/db/reset once Supabase recovers")
    logger.info("🕐 Expected recovery time: 15-30 minutes after stress test")
    
    # Reset the engine to clean state for later use
    try:
        engine.dispose()
        logger.info("Engine disposed - ready for later reconnection")
    except Exception as dispose_error:
        logger.warning(f"Could not dispose engine: {dispose_error}")

