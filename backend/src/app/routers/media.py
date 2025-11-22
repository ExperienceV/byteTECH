from fastapi import APIRouter, Response, Request, HTTPException
from fastapi.responses import StreamingResponse
from pathlib import Path
import re
import io
import magic
from app.utils import storage


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
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, Range"
    response.headers["Accept-Ranges"] = "bytes"
    return response


def _iter_bytes(content: bytes, start: int, end: int, chunk_size: int = 1024 * 1024):
    """Iterate over a byte string respecting start/end (inclusive)."""
    total = end - start + 1
    stream = io.BytesIO(content[start:end + 1])
    sent = 0
    while sent < total:
        chunk = stream.read(min(chunk_size, total - sent))
        if not chunk:
            break
        sent += len(chunk)
        yield chunk


@media_router.get("/get_file")
@media_router.head("/get_file", include_in_schema=False)
async def get_files_gd(file_id: str, request: Request):
    # Try to get file from storage (R2 or local)
    result = storage.get_file_by_name(file_id)
    if not result:
        raise HTTPException(status_code=404, detail="File not found")

    file_content, mime_type = result
    file_size = len(file_content)

    range_header = request.headers.get("range") or request.headers.get("Range")
    headers = {
        "Content-Disposition": f"inline; filename={file_id}",
        "Cache-Control": "public, max-age=604800, immutable",
        "Accept-Ranges": "bytes",
    }

    # Handle Range Requests for seeking
    if range_header:
        m = re.match(r"bytes=(\d+)-(\d+)?", range_header)
        if not m:
            # Malformed range
            raise HTTPException(status_code=416, detail="Invalid Range header")
        start = int(m.group(1))
        end = int(m.group(2)) if m.group(2) is not None else file_size - 1
        if start >= file_size or end >= file_size or start > end:
            # Out of range
            raise HTTPException(status_code=416, detail="Range Not Satisfiable")

        content_length = end - start + 1
        headers.update({
            "Content-Range": f"bytes {start}-{end}/{file_size}",
            "Content-Length": str(content_length),
        })

        response = StreamingResponse(
            _iter_bytes(file_content, start, end),
            status_code=206,
            media_type=mime_type,
            headers=headers,
        )
    else:
        # Full content
        headers["Content-Length"] = str(file_size)
        response = StreamingResponse(
            io.BytesIO(file_content),
            media_type=mime_type,
            headers=headers,
        )

    # CORS for allowed origins
    allowed_origins = [
        "https://bytetechedu.com",
        "http://localhost:3000"
    ]
    origin = request.headers.get("origin")
    if origin in allowed_origins:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
    return response