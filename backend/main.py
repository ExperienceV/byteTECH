from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

CORSMiddleware(
    app,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Set routers
from routers.auth import auth_router
from routers.media import media_router
from routers.menu import menu_router
from routers.payment import payment_router