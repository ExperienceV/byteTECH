from bcrypt import hashpw, gensalt, checkpw

def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.
    
    Args:
        password (str): The password to hash.
        
    Returns:
        str: The hashed password.
    """
    return hashpw(password.encode('utf-8'), gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password.
    
    Args:
        plain_password (str): The plain password to verify.
        hashed_password (str): The hashed password to check against.
        
    Returns:
        bool: True if the passwords match, False otherwise.
    """
    return checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))