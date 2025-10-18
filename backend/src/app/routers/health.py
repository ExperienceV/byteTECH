"""
Health check router with database connection monitoring
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from app.database.session import health_check, reset_connection_pool
from app.parameters import settings
import logging

logger = logging.getLogger(__name__)

health_router = APIRouter(tags=["health"], prefix="/health")

@health_router.get("/")
async def health_status():
    """
    Basic health check endpoint
    """
    return JSONResponse(
        content={
            "status": "healthy",
            "version": settings.VERSION,
            "debug": settings.DEBUG
        },
        status_code=200
    )

@health_router.get("/db")
async def database_health():
    """
    Database connection health check
    """
    try:
        is_healthy = health_check()
        
        if is_healthy:
            return JSONResponse(
                content={
                    "status": "healthy",
                    "database": "connected",
                    "message": "Database connection is working properly"
                },
                status_code=200
            )
        else:
            logger.warning("Database health check failed")
            return JSONResponse(
                content={
                    "status": "unhealthy",
                    "database": "disconnected",
                    "message": "Database connection failed"
                },
                status_code=503
            )
            
    except Exception as e:
        logger.error(f"Database health check error: {e}")
        return JSONResponse(
            content={
                "status": "error",
                "database": "error",
                "message": f"Database health check failed: {str(e)}"
            },
            status_code=503
        )

@health_router.post("/db/reset")
async def reset_database_pool():
    """
    Reset the database connection pool - useful for resolving persistent SSL issues
    """
    try:
        reset_connection_pool()
        
        # Verify the reset worked
        is_healthy = health_check()
        
        if is_healthy:
            return JSONResponse(
                content={
                    "status": "success",
                    "message": "Database connection pool reset successfully",
                    "database": "connected"
                },
                status_code=200
            )
        else:
            return JSONResponse(
                content={
                    "status": "warning",
                    "message": "Connection pool reset but health check still failing",
                    "database": "disconnected",
                    "tip": "If Supabase SSL protection is active, wait 15-30 minutes after stress testing"
                },
                status_code=503
            )
            
    except Exception as e:
        logger.error(f"Failed to reset connection pool: {e}")
        return JSONResponse(
            content={
                "status": "error",
                "message": f"Failed to reset connection pool: {str(e)}"
            },
            status_code=500
        )

@health_router.post("/db/reinitialize")
async def reinitialize_database():
    """
    Attempt to reinitialize database tables - useful after Supabase SSL protection recovery
    """
    try:
        from app.database.base import Base
        from app.database.config import engine
        from sqlalchemy.exc import OperationalError
        
        logger.info("Attempting manual database reinitialization...")
        
        # First reset the connection pool
        reset_connection_pool()
        
        # Try to recreate tables
        Base.metadata.create_all(bind=engine)
        
        # Verify it worked
        is_healthy = health_check()
        
        if is_healthy:
            return JSONResponse(
                content={
                    "status": "success",
                    "message": "Database reinitialized successfully",
                    "database": "connected",
                    "action": "Tables created and connection verified"
                },
                status_code=200
            )
        else:
            return JSONResponse(
                content={
                    "status": "partial_success",
                    "message": "Tables created but health check still failing",
                    "database": "unstable",
                    "tip": "Try again in a few minutes if Supabase is still recovering"
                },
                status_code=202
            )
            
    except OperationalError as e:
        error_msg = str(e).lower()
        if 'ssl connection has been closed' in error_msg:
            return JSONResponse(
                content={
                    "status": "ssl_protection_active",
                    "message": "Supabase SSL protection still active",
                    "database": "blocked",
                    "tip": "Wait 15-30 minutes after stress testing, then try again",
                    "error": str(e)
                },
                status_code=503
            )
        else:
            logger.error(f"Database reinitialization failed: {e}")
            return JSONResponse(
                content={
                    "status": "error",
                    "message": f"Database reinitialization failed: {str(e)}"
                },
                status_code=500
            )
    except Exception as e:
        logger.error(f"Unexpected error during reinitialization: {e}")
        return JSONResponse(
            content={
                "status": "error",
                "message": f"Unexpected error: {str(e)}"
            },
            status_code=500
        )
