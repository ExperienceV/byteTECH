from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


# -------- MiddlWeware Configuration --------

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
from routers.payment import payment_router
from routers.courses import courses_router
from routers.forums import forums_router
from routers.example import example_router

router_list = [
    auth_router,
    courses_router,
    payment_router,
    forums_router
]

for router in router_list:
    app.include_router(router)


# -------- Setup Database --------
from database.base import Base
from database.config import engine

Base.metadata.create_all(bind=engine)

