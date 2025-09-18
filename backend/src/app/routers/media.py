from fastapi import APIRouter, Response, Request, HTTPException
from fastapi.responses import StreamingResponse
from pathlib import Path
import re
import magic


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


def _iter_file(path: Path, start: int, end: int, chunk_size: int = 1024 * 1024):
    with path.open("rb") as f:
        f.seek(start)
        remaining = end - start + 1
        while remaining > 0:
            read_size = min(chunk_size, remaining)
            data = f.read(read_size)
            if not data:
                break
            yield data
            remaining -= len(data)


@media_router.get("/get_file")
@media_router.head("/get_file", include_in_schema=False)
async def get_files_gd(file_id: str, request: Request):
    # Local storage path (aligned with save_file default)
    file_path = Path("./uploads") / file_id
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="File not found")

    file_size = file_path.stat().st_size
    mime_type = magic.from_file(str(file_path), mime=True) or "application/octet-stream"

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
            _iter_file(file_path, start, end),
            status_code=206,
            media_type=mime_type,
            headers=headers,
        )
    else:
        # Full content
        headers["Content-Length"] = str(file_size)
        response = StreamingResponse(
            file_path.open("rb"),
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