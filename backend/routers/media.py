from fastapi import APIRouter


media_router = APIRouter()


@media_router.get("/mediafile")
async def get_files_gd(path: str):
#Continuar endpoitn para obtener archivos multimedia
    pass