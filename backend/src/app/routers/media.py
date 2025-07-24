from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import io
from app.services.services_google import download_file_from_drive


media_router = APIRouter(tags=["media"], prefix="/media")


@media_router.get("/get_file")
async def get_files_gd(file_id: str):
    """
    Descarga un archivo desde Google Drive mediante su ID
    
    Entry:
        file_id: str (ID del archivo en Google Drive)
    
    Return:
        StreamingResponse con:
            - status_code: 200
            - content: bytes del archivo
            - headers:
                - Content-Type: según el tipo MIME del archivo
                - Content-Disposition: nombre original del archivo
    
    Errors:
        (Nota: Los errores se manejan internamente en download_file_from_drive)
        404: Archivo no encontrado en Google Drive
        500: Error al descargar el archivo
    
    Ejemplo de uso:
        GET /media/get_file?file_id=1a2b3c4d5e6f7g
    """
    content, filename, mime_type = download_file_from_drive(file_id)
    return StreamingResponse(
        io.BytesIO(content),
        media_type=mime_type,
        headers={
            "Content-Disposition": f"attachment; filename={filename}",
            "Cache-Control": "public, max-age=604800, immutable"
            }
    )