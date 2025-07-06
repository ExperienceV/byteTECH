from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


# -------- Middleware Configuration --------

origins = [
    "http://localhost",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],  # Métodos permitidos: GET, POST, etc.
    allow_headers=["*"],  # Headers permitidos
)


# -------- Include Routers --------
from routers.auth import auth_router
from routers.media import media_router
from routers.menu import menu_router
from routers.payment import payment_router
from routers.forums import forums_router

router_list = [
    auth_router,
    media_router,
    menu_router,
    payment_router,
    forums_router
]

for router in router_list:
    app.include_router(router)


# -------- Setup Database --------
from database.base import Base
from database.config import engine

Base.metadata.create_all(bind=engine)

