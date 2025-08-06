from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.middlewares import TokenRefreshMiddleware
from app.parameters import settings

app = FastAPI(
    title="ByteTech API",
    version=settings.VERSION
    #docs_url="/docs" if settings.DEBUG else None  # Desactiva docs en producción
)

# -------- MiddlWeware Configuration --------

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ALLOW_ORIGINS,  # Orígenes permitidos
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,  # Métodos permitidos: GET, POST, etc.
    allow_headers=settings.CORS_ALLOW_HEADERS,  # Headers permitidos
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


router_list = [
    auth_router,
    courses_router,
    forums_router,
    media_router,
    workbrench_router, 
    support_router,
    user_router,
    stats_router
]

for router in router_list:
    app.include_router(router, prefix="/api")


# -------- Setup Database --------
from app.database.base import Base
from app.database.config import engine

Base.metadata.create_all(bind=engine)

