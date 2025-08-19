from fastapi import APIRouter, Depends, Form, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.models import User
from app.dependencies import get_db
from app.database.queries.user import (
    create_user, 
    get_user_by_email, 
    get_all_users,
    update_user
) 
from app.database.queries.codes import (
    get_valid_code
)
from app.utils.security import (
    hash_password, 
    verify_password
)
from app.utils.signature import (
    create_access_token,
    create_refresh_token,
    verify_token
)
from app.parameters import settings
from app.utils.util_routers import process_code
from app.database.queries.tokens import delete_expired_tokens

auth_router = APIRouter(tags=["auth"], prefix="/auth")

# Detectar entorno usando settings.DEBUG
IS_LOCAL = settings.DEBUG

@auth_router.post("/init_register", 
    summary="Initialize user registration",
    response_description="Returns the created user with verification code",
    responses={
        201: {
            "description": "User created successfully",
            "content": {
                "application/json": {
                    "example": {
                        "message": "User created successfully",
                        "user": {
                            "id": 1,
                            "name": "username",
                            "email": "user@example.com",
                            "is_sensei": False,
                            "code": "123456"
                        }
                    }
                }
            }
        },
        400: {
            "description": "User already exists",
            "content": {
                "application/json": {
                    "example": {"message": "User already exists"}
                }
            }
        },
        500: {
            "description": "Internal server error",
            "content": {
                "application/json": {
                    "example": {"message": "Failed to create user"}
                }
            }
        }
    }
)
async def init_register(
    name: str = Form(..., description="Full name of the user"),
    email: str = Form(..., description="Email address of the user"),
    password: str = Form(..., description="Password for the user"),
    db: Session = Depends(get_db)
):
    """
    Initializes the user registration process by:
    1. Checking if user already exists
    2. Hashing the password
    3. Creating the user record
    4. Generating and sending a verification code
    
    Args:
        user (User): User object containing:
            - name (str): User's full name
            - email (str): User's email address
            - password (str): User's plaintext password
            - is_sensei (bool, optional): Whether user is a sensei/teacher
        
        db (Session): Database session dependency
    
    Returns:
        JSONResponse: Contains:
            - Success (201): User details and verification code
            - Error (400/500): Appropriate error message
    """
    # Check if the user already exists
    existing_user = get_user_by_email(email=email, db=db)
    if existing_user:
        return JSONResponse(status_code=400, content={"message": "User already exists"})
    
    # Hash the password before storing it
    hashed_password = hash_password(password)

    # Create the user in the database
    response_create = create_user(
        name=name,
        email=email,
        password=hashed_password,
        is_sensei=False,
        db=db
    )
    
    if not response_create:
        return JSONResponse(status_code=500, content={"message": "Failed to create user"})
    
    # Process of create and send verification code
    process_response = process_code(
        db=db,
        user_id=response_create.id,
        email=response_create.email,
        username=response_create.username
    )

    if process_response["status"] == 500:
        return JSONResponse(
            status_code=500,
            content=process_response["message"]
        )

    # return the created user information
    return JSONResponse(
        status_code=200,
        content={
            "message": "User created successfully",
            "user": {
                "id": response_create.id,
                "name": response_create.username,
                "email": response_create.email,
                "is_sensei": response_create.is_sensei
            }
        }
    )


@auth_router.post("/verify_register",
    summary="Verify user registration",
    response_description="Returns verified user info and sets auth cookies",
    responses={
        200: {
            "description": "User successfully verified",
            "content": {
                "application/json": {
                    "example": {
                        "message": "User successfully verified",
                        "user": {
                            "user_id": 1,
                            "user_name": "username",
                            "email": "user@example.com",
                            "is_sensei": False,
                            "is_verify": True
                        }
                    }
                }
            },
            "headers": {
                "Set-Cookie": {
                    "description": "Sets access and refresh token cookies",
                    "schema": {
                        "type": "string",
                        "example": "access_token=abc123; HttpOnly; Max-Age=3600"
                    }
                }
            }
        },
        400: {
            "description": "Invalid verification code",
            "content": {
                "application/json": {
                    "example": {"message": "Invalid verification code"}
                }
            }
        },
        404: {
            "description": "User not found",
            "content": {
                "application/json": {
                    "example": {"message": "User not found"}
                }
            }
        }
    }
)
async def verify_register(
    email: str = Form(..., description="Email address of user to verify"),
    code: str = Form(..., description="6-digit verification code"),
    db: Session = Depends(get_db)
):
    """
    Completes the registration process by:
    1. Verifying the provided code matches what was sent
    2. Marking the user as verified in database
    3. Setting access and refresh token cookies
    
    Args:
        email (str): Email address used during registration
        code (str): Verification code received by user
        db (Session): Database session dependency
    
    Returns:
        JSONResponse: Contains:
            - Success (200): Verified user information
            - Error (400/404): Appropriate error message
        
        Cookies:
            - access_token: JWT for authenticated requests
            - refresh_token: JWT for refreshing access token
    """

    # Get id of the user by email
    user = get_user_by_email(email=email, db=db)
    if not user:
        return JSONResponse(status_code=404, content={"message": "User not found"})
    
    user_id = user["id"]

    # Verify the code
    code_response = get_valid_code(
        db=db, 
        code=code,
        user_id=user_id
        )
    
    if code_response["status"] != "valid":
        return JSONResponse(status_code=400, content={"message": code_response["message"]})
    
    # Verify user
    update_response = update_user(
        db=db,
        user_id=user_id,
        verify=True
    )

    if not update_response:
        return JSONResponse(
            status_code=400,
            content="Failed to verify user"
        )

    user_mtd = {
        "user_id": user_id,
        "user_name": user["name"],
        "email": user["email"],
        "is_sensei": user["is_sensei"],
        "is_verify": True
    }

    response = JSONResponse(
        status_code=200,
        content={"message": "User successfully verified",
                 "user": user_mtd}
    )

    access_token = create_access_token(data=user_mtd)
    refresh_token = create_refresh_token(data=user_mtd)

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=settings.HTTPONLY,
        max_age=settings.ACCESS_TOKEN_MAX_AGE,
        secure=False if IS_LOCAL else settings.SECURE,
        samesite=settings.SAMESITE,
        domain=None if IS_LOCAL else settings.DOMAIN
    ) 
    
    response.set_cookie(
        key="refresh_token", 
        value=refresh_token, 
        httponly=settings.HTTPONLY, 
        max_age=settings.REFRESH_TOKEN_MAX_AGE,
        secure=False if IS_LOCAL else settings.SECURE,
        samesite=settings.SAMESITE,
        domain=None if IS_LOCAL else settings.DOMAIN
    )  

    return response


@auth_router.post("/login",
    summary="Authenticate user and generate JWT tokens",
    response_description="Returns user info and sets auth cookies",
    responses={
        200: {
            "description": "Login successful",
            "content": {
                "application/json": {
                    "example": {
                        "message": "Login successful",
                        "user": {
                            "id": 1,
                            "name": "username",
                            "email": "user@example.com",
                            "is_sensei": False,
                            "is_verify": True
                        }
                    }
                }
            },
            "headers": {
                "Set-Cookie": {
                    "description": "Sets access and refresh token cookies",
                    "schema": {
                        "type": "string",
                        "example": "access_token=abc123; HttpOnly; Max-Age=3600"
                    }
                }
            }
        },
        401: {
            "description": "Invalid credentials",
            "content": {
                "application/json": {
                    "example": {"message": "Invalid password"}
                }
            }
        },
        404: {
            "description": "User not found",
            "content": {
                "application/json": {
                    "example": {"message": "User not found"}
                }
            }
        },
        428: {
            "description": "User not verified",
            "content": {
                "application/json": {
                    "example": {
                        "message": "User not verified. Please check your email for the verification code."
                    }
                }
            }
        },
        500: {
            "description": "Verification code generation failed",
            "content": {
                "application/json": {
                    "example": {"message": "Failed to generate verification code"}
                }
            }
        }
    }
)
async def login(
    email: str = Form(..., description="User's registered email"),
    password: str = Form(..., description="User's password"), # Modifica el Front.
    db: Session = Depends(get_db)
):
    """
    Authenticates a user and generates JWT tokens.
    
    Handles three scenarios:
    1. Successful login (returns user info + sets cookies)
    2. Unverified user (returns new verification code)
    3. Failed login (invalid credentials or user not found)

    Args:
        user (User): User object containing:
            - email (str): User's registered email
            - password (str): User's password
            - name (str, optional): Not required for login
        
        db (Session): Database session dependency

    Returns:
        JSONResponse: With different outcomes:
            - 200: Successful login (user info + cookies)
            - 401: Invalid password
            - 404: User not found
            - 428: User exists but not verified (includes new code)
            - 500: Verification code generation failed

    Cookies (on success):
        - access_token: JWT for authenticated requests (expires in 1h)
        - refresh_token: JWT for refreshing access token (expires in 7d)
    """
    get_response = get_user_by_email(
        email=email,
        db=db
    )
    if not get_response:
        return JSONResponse(status_code=404, content={"message": "User not found"})
    
    verify_pswd_result = verify_password(password, get_response["password"])
    if not verify_pswd_result:
        return JSONResponse(status_code=401, content={"message": "Invalid password"})
    
    response = JSONResponse(status_code=200, content={"message": "Login successful", "user": get_response})

    #  if the user is not verified, return a message
    if not get_response["is_verify"]:
        # Init process of verification
        process_response = process_code(
            db=db,
            user_id=get_response["id"],
            email=get_response["email"],
            username=get_response["name"]
        )

        if process_response["status"] == 500:
            return JSONResponse(
                status_code=500,
                content=process_response["message"]
        )

        return JSONResponse(
            status_code=428,
            content={
                "message": "User not verified. Please check your email for the verification code."
            }
        )

    user_id = get_response["id"]
    user_name = get_response["name"]
    user_mtd = {
        "user_id": user_id,
        "user_name": user_name,
        "email": email,
        "is_sensei": get_response["is_sensei"],
        "is_verify": get_response["is_verify"]
    }
    access_token = create_access_token(data=user_mtd)
    refresh_token = create_refresh_token(data=user_mtd)

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=settings.HTTPONLY,
        max_age=settings.ACCESS_TOKEN_MAX_AGE,
        secure=False if IS_LOCAL else settings.SECURE,
        samesite=settings.SAMESITE,
        domain=None if IS_LOCAL else settings.DOMAIN
    ) 
    
    response.set_cookie(
        key="refresh_token", 
        value=refresh_token, 
        httponly=settings.HTTPONLY, 
        max_age=settings.REFRESH_TOKEN_MAX_AGE,
        secure=False if IS_LOCAL else settings.SECURE,
        samesite=settings.SAMESITE,
        domain=None if IS_LOCAL else settings.DOMAIN
    )  

    return response


@auth_router.post("/logout")
async def logout():
    """
    Clears authentication cookies
    
    Return:
        status_code: 200
        content: json
    """
    response = JSONResponse(status_code=200, content={"message": "Logout successful"})
    response.delete_cookie(
        key="access_token",
        httponly=settings.HTTPONLY,
        secure=False if IS_LOCAL else settings.SECURE,
        samesite=settings.SAMESITE,
        domain=None if IS_LOCAL else settings.DOMAIN
    )
    response.delete_cookie(
        key="refresh_token",
        httponly=settings.HTTPONLY,
        secure=False if IS_LOCAL else settings.SECURE,
        samesite=settings.SAMESITE,
        domain=None if IS_LOCAL else settings.DOMAIN
    )
    return response


@auth_router.post("/init_restore_password",)
async def init_restore_password(
    email: str = Form(..., description="User's registered email"), 
    db: Session = Depends(get_db)
):
    """
    Initiates password restoration process by sending a URL verification to the user's email.
    
    Args:
        email (str): User's registered email address
        db (Session): Database session dependency
    
    Returns:
        JSONResponse: Contains:
            - Success (200): Message indicating code sent
            - Error (404): User not found
            - Error (500): Failed to send code
    """
    user = get_user_by_email(email=email, db=db)
    if not user:
        return JSONResponse(status_code=404, content={"message": "User not found"})
    
    process_response = process_code(
        db=db,
        user_id=user["id"],
        email=user["email"],
        username=user["name"],
        is_restore=True
    )

    if process_response["status"] == 500:
        return JSONResponse(status_code=500, content=process_response["message"])

    # Delete expired tokens
    delete_expired_tokens(db=db)

    return JSONResponse(status_code=200, content={
        "message": "Verification URL sent to your email",
        "token" : process_response["value"]
        })


@auth_router.post("/restore_password")
async def restore_password(
    db: Session = Depends(get_db),
    token: str = Form(..., description="Token in the URL for password restoration"),
    new_password: str = Form(..., description="New password for the user")
):
    try:
        # Verify the token
        payload = verify_token(token=token)
        user_id = payload["user_id"]
        
        # Hash the new password
        hashed_password = hash_password(new_password)

        # Update the user's password in the database
        update_response = update_user(
            db=db,
            user_id=user_id,
            password=hashed_password
        )

        if not update_response:
            return JSONResponse(status_code=500, content={"message": "Failed to update password"})
        
        return JSONResponse(status_code=200, content={"message": "Password successfully updated"})
    
    except HTTPException as e:
        return JSONResponse(status_code=e.status_code, content={"message": e.detail})
    


@auth_router.get("/get_users")
async def get_users(db: Session = Depends(get_db)):
    """
    Gets all registered users
    
    Return:
        status_code: 200 or 404
        content: json list of users
    
    Errors:
        404: No users found
    """
    users = get_all_users(db=db)
    if not users:
        return JSONResponse(status_code=404, content={"message": "No users found"})
    
    return JSONResponse(status_code=200, content=users)
