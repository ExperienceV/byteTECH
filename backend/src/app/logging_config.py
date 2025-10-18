"""
Enhanced logging configuration for monitoring Supabase SSL connection issues
"""

import logging
import logging.handlers
import sys
from pathlib import Path
from app.parameters import settings

def setup_logging():
    """
    Configure comprehensive logging for database connection monitoring
    """
    # Create logs directory if it doesn't exist
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    
    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.DEBUG if settings.DEBUG else logging.INFO)
    
    # Clear existing handlers
    root_logger.handlers.clear()
    
    # Console handler for immediate feedback
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    console_handler.setFormatter(console_formatter)
    root_logger.addHandler(console_handler)
    
    # File handler for persistent logging
    file_handler = logging.handlers.RotatingFileHandler(
        log_dir / "app.log",
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5
    )
    file_handler.setLevel(logging.DEBUG)
    file_formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s'
    )
    file_handler.setFormatter(file_formatter)
    root_logger.addHandler(file_handler)
    
    # Separate handler for database connection issues
    db_handler = logging.handlers.RotatingFileHandler(
        log_dir / "database.log",
        maxBytes=5*1024*1024,  # 5MB
        backupCount=3
    )
    db_handler.setLevel(logging.WARNING)
    db_formatter = logging.Formatter(
        '%(asctime)s - DB_ERROR - %(levelname)s - %(message)s'
    )
    db_handler.setFormatter(db_formatter)
    
    # Create database logger
    db_logger = logging.getLogger("database")
    db_logger.addHandler(db_handler)
    db_logger.setLevel(logging.WARNING)
    
    # Configure SQLAlchemy logging for connection monitoring
    sqlalchemy_logger = logging.getLogger("sqlalchemy.engine")
    sqlalchemy_logger.setLevel(logging.WARNING if settings.DEBUG else logging.ERROR)
    
    # Configure psycopg2 logging for SSL issues
    psycopg2_logger = logging.getLogger("psycopg2")
    psycopg2_logger.setLevel(logging.WARNING)
    
    logging.info("Logging configuration initialized")
    
    return root_logger

def log_db_error(error_type: str, error_message: str, context: dict = None):
    """
    Specialized logging function for database errors
    
    Args:
        error_type: Type of error (SSL, Connection, Query, etc.)
        error_message: The error message
        context: Additional context information
    """
    db_logger = logging.getLogger("database")
    
    log_message = f"[{error_type}] {error_message}"
    if context:
        log_message += f" | Context: {context}"
    
    db_logger.error(log_message)
    
    # Also log to console if it's an SSL error
    if "ssl" in error_type.lower():
        logging.error(f"SSL Connection Issue: {error_message}")

def log_connection_retry(attempt: int, max_attempts: int, error: str):
    """
    Log connection retry attempts
    """
    db_logger = logging.getLogger("database")
    db_logger.warning(
        f"Connection retry {attempt}/{max_attempts} - Error: {error}"
    )

def log_performance_warning(operation: str, duration: float, threshold: float = 5.0):
    """
    Log slow database operations
    """
    if duration > threshold:
        db_logger = logging.getLogger("database")
        db_logger.warning(
            f"Slow operation detected: {operation} took {duration:.2f}s (threshold: {threshold}s)"
        )
