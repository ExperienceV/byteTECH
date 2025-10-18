"""
Database session management with retry logic for Supabase SSL connection issues
"""

import logging
import time
import asyncio
from contextlib import contextmanager
from typing import Generator, Optional, Any, Callable, Awaitable
from functools import wraps

from sqlalchemy.orm import Session
from sqlalchemy.exc import (
    OperationalError, 
    DisconnectionError, 
    TimeoutError,
    StatementError
)
from sqlalchemy import text

from .config import SessionLocal, engine
from app.logging_config import log_db_error, log_connection_retry

logger = logging.getLogger(__name__)

class DatabaseConnectionError(Exception):
    """Custom exception for database connection issues"""
    pass

def retry_db_operation(max_retries: int = 3, delay: float = 1.0, backoff: float = 2.0):
    """
    Decorator to retry database operations on connection failures
    Works with both sync and async functions
    
    Args:
        max_retries: Maximum number of retry attempts
        delay: Initial delay between retries in seconds
        backoff: Multiplier for delay on each retry
    """
    def decorator(func: Callable) -> Callable:
        if asyncio.iscoroutinefunction(func):
            @wraps(func)
            async def async_wrapper(*args, **kwargs):
                last_exception = None
                current_delay = delay
                
                for attempt in range(max_retries + 1):
                    try:
                        return await func(*args, **kwargs)
                    except (OperationalError, DisconnectionError, TimeoutError) as e:
                        last_exception = e
                        error_msg = str(e).lower()
                        
                        # Check if it's an SSL connection error
                        if any(keyword in error_msg for keyword in [
                            'ssl connection has been closed',
                            'connection already closed',
                            'server closed the connection',
                            'connection was closed',
                            'ssl error',
                            'connection lost',
                            'ssl connection has been closed unexpectedly'
                        ]):
                            if attempt < max_retries:
                                log_connection_retry(attempt + 1, max_retries + 1, str(e))
                                log_db_error("SSL_RETRY", str(e), {
                                    "attempt": attempt + 1,
                                    "function": func.__name__,
                                    "delay": current_delay
                                })
                                await asyncio.sleep(current_delay)
                                current_delay *= backoff
                                continue
                        
                        # Re-raise if it's not a retryable error or max retries exceeded
                        raise e
                    except Exception as e:
                        # Don't retry on non-connection errors
                        raise e
                
                # If we get here, all retries failed
                log_db_error("SSL_FAILURE", f"All {max_retries + 1} attempts failed", {
                    "function": func.__name__,
                    "last_error": str(last_exception)
                })
                raise DatabaseConnectionError(f"Database operation failed after {max_retries + 1} attempts") from last_exception
            
            return async_wrapper
        else:
            @wraps(func)
            def sync_wrapper(*args, **kwargs):
                last_exception = None
                current_delay = delay
                
                for attempt in range(max_retries + 1):
                    try:
                        return func(*args, **kwargs)
                    except (OperationalError, DisconnectionError, TimeoutError) as e:
                        last_exception = e
                        error_msg = str(e).lower()
                        
                        # Check if it's an SSL connection error
                        if any(keyword in error_msg for keyword in [
                            'ssl connection has been closed',
                            'connection already closed',
                            'server closed the connection',
                            'connection was closed',
                            'ssl error',
                            'connection lost',
                            'ssl connection has been closed unexpectedly'
                        ]):
                            if attempt < max_retries:
                                log_connection_retry(attempt + 1, max_retries + 1, str(e))
                                log_db_error("SSL_RETRY", str(e), {
                                    "attempt": attempt + 1,
                                    "function": func.__name__,
                                    "delay": current_delay
                                })
                                time.sleep(current_delay)
                                current_delay *= backoff
                                continue
                        
                        # Re-raise if it's not a retryable error or max retries exceeded
                        raise e
                    except Exception as e:
                        # Don't retry on non-connection errors
                        raise e
                
                # If we get here, all retries failed
                log_db_error("SSL_FAILURE", f"All {max_retries + 1} attempts failed", {
                    "function": func.__name__,
                    "last_error": str(last_exception)
                })
                raise DatabaseConnectionError(f"Database operation failed after {max_retries + 1} attempts") from last_exception
            
            return sync_wrapper
    return decorator

@contextmanager
def get_db_session() -> Generator[Session, None, None]:
    """
    Context manager for database sessions with automatic cleanup and retry logic
    """
    session = None
    try:
        session = SessionLocal()
        
        # Test the connection
        session.execute(text("SELECT 1"))
        session.commit()
        
        yield session
        
    except (OperationalError, DisconnectionError) as e:
        if session:
            session.rollback()
        log_db_error("CONNECTION_ERROR", str(e), {"context": "session_creation"})
        raise DatabaseConnectionError(f"Failed to establish database connection: {e}") from e
    except Exception as e:
        if session:
            session.rollback()
        logger.error(f"Database session error: {e}")
        raise e
    finally:
        if session:
            try:
                session.close()
            except Exception as e:
                logger.warning(f"Error closing session: {e}")

@retry_db_operation(max_retries=3, delay=0.5, backoff=2.0)
def execute_with_retry(session: Session, query, params: Optional[dict] = None):
    """
    Execute a query with retry logic for connection failures
    
    Args:
        session: SQLAlchemy session
        query: SQL query or SQLAlchemy query object
        params: Query parameters
    
    Returns:
        Query result
    """
    try:
        if params:
            result = session.execute(query, params)
        else:   
            result = session.execute(query)
        
        session.commit()
        return result
        
    except (OperationalError, DisconnectionError) as e:
        session.rollback()
        log_db_error("QUERY_ERROR", str(e), {"context": "query_execution"})
        raise e

def get_db():
    """
    Dependency function for FastAPI to get database session
    """
    with get_db_session() as session:
        yield session

@retry_db_operation(max_retries=2, delay=0.3)
def health_check() -> bool:
    """
    Check database connection health
    
    Returns:
        True if connection is healthy, False otherwise
    """
    try:
        with get_db_session() as session:
            session.execute(text("SELECT 1"))
            return True
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return False

def reset_connection_pool():
    """
    Reset the connection pool - useful when experiencing persistent connection issues
    """
    try:
        engine.dispose()
        logger.info("Database connection pool reset successfully")
    except Exception as e:
        logger.error(f"Failed to reset connection pool: {e}")
        raise e
