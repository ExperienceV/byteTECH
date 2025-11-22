import os
import uuid
from typing import Optional, Tuple
import boto3
from botocore.client import Config

from app.parameters import settings


# --- Configuración R2 ---
r2_client = boto3.client(
    "s3",
    endpoint_url=settings.R2_ENDPOINT,
    aws_access_key_id=settings.R2_ACCESS_KEY_ID,
    aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
    config=Config(signature_version="s3v4"),
)

BUCKET = settings.R2_BUCKET


# --- Utilidades ---
def get_unique_name(extension: str = "") -> str:
    name = uuid.uuid4().hex[:8]
    return f"{name}{extension}" if extension else name


# --- Guardar archivo en R2 ---
def save_file(content: bytes, name: str) -> str:
    """Guarda el archivo en Cloudflare R2 y devuelve la URL pública."""
    try:
        r2_client.put_object(
            Bucket=BUCKET,
            Key=name,
            Body=content,
        )
        return f"{settings.R2_ENDPOINT.rstrip('/')}/{BUCKET}/{name}"
    except Exception as e:
        print(f"[R2] Error al subir '{name}': {e}")
        raise


# --- Obtener archivo desde R2 ---
def get_file_by_name(name: str) -> Optional[Tuple[bytes, str]]:
    """Obtiene un archivo de R2 (bytes, mime_type) o None si no existe."""
    try:
        resp = r2_client.get_object(Bucket=BUCKET, Key=name)
        raw = resp["Body"].read()
        mime_type = resp.get("ContentType", "application/octet-stream")
        return raw, mime_type
    except r2_client.exceptions.NoSuchKey:
        print(f"[R2] Archivo '{name}' no encontrado en el bucket.")
        return None
    except Exception as e:
        print(f"[R2] Error al obtener '{name}': {e}")
        return None


# --- Eliminar archivo en R2 ---
def delete_file(name: str) -> bool:
    """Elimina un archivo del bucket R2."""
    try:
        r2_client.delete_object(Bucket=BUCKET, Key=name)
        print(f"[R2] Archivo '{name}' eliminado correctamente.")
        return True
    except r2_client.exceptions.NoSuchKey:
        print(f"[R2] Archivo '{name}' no existe en el bucket.")
        return False
    except Exception as e:
        print(f"[R2] Error al eliminar '{name}': {e}")
        return False
