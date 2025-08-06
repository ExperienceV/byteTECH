from fastapi import APIRouter, Response, Request
from fastapi.responses import StreamingResponse
import io
from app.services.services_google import download_file_from_drive


media_router = APIRouter(tags=["media"], prefix="/media")


@media_router.options("/get_file")
async def options_get_file(request: Request):
    origin = request.headers.get("origin")
    allowed_origins = [
        "https://bytetechedu.com",
        "http://localhost:3000"
    ]
    response = Response()
    if origin in allowed_origins:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response


@media_router.get("/get_file")
@media_router.head("/get_file", include_in_schema=False)
async def get_files_gd(file_id: str, request: Request):
    content, filename, mime_type = download_file_from_drive(file_id)
    response = StreamingResponse(
        io.BytesIO(content),
        media_type=mime_type,
        headers={
            "Content-Disposition": f"inline; filename={filename}",
            "Cache-Control": "public, max-age=604800, immutable"
        }
    )
    # Soporte para varios orígenes permitidos
    allowed_origins = [
        "https://bytetechedu.com",
        "http://localhost:3000"
    ]
    origin = request.headers.get("origin")
    if origin in allowed_origins:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
    return response