from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


# -------- Middleware Configuration --------
CORSMiddleware(
    app,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)


# -------- Include Routers --------
from routers.auth import auth_router
from routers.media import media_router
from routers.menu import menu_router
from routers.payment import payment_router

router_list = [
    auth_router,
    media_router,
    menu_router,
    payment_router,
]

for router in router_list:
    app.include_router(router)


# -------- Setup Database --------
from backend.database.base import Base
from backend.database.config import engine

Base.metadata.create_all(bind=engine)

