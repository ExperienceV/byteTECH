import os
import uuid
from pathlib import Path
from app.parameters import settings

prod = settings.DEBUG

upload_dir = "./uploads" if prod else "/app/uploads"


def get_unique_name(extension=""):

    name = str(uuid.uuid4())[:8]
    return f"{name}{extension}" if extension else name


def save_file(
    content: bytes,
    name: str,
    directory: str = upload_dir
):

    Path(directory).mkdir(parents=True, exist_ok=True)
    
    ruta = Path(directory) / name
    
    modo = 'w' if isinstance(content, str) else 'wb'
    encoding = {'encoding': 'utf-8'} if isinstance(content, str) else {}
    
    with open(ruta, modo, **encoding) as f:
        f.write(content)
    
    return str(ruta)


def get_file_by_name(
    name: str,
    directory: str = upload_dir
):
    import magic    

    ruta = Path(directory) / name
    
    if not ruta.exists():
        print(f"Archivo '{name}' no encontrado en {directory}")
        return None
    
    try:
        with open(ruta, 'rb') as f:
            bytes = f.read()
            mime_type = magic.from_file(str(ruta), mime=True)
            return bytes, mime_type
    except UnicodeDecodeError:
        with open(ruta, 'rb') as f:
            mime_type = magic.from_file(str(ruta), mime=True)
            bytes = f.read()
            return bytes, mime_type


def delete_file(
    name: str,
    directory: str = upload_dir
):
    ruta = Path(directory) / name
    
    if not ruta.exists():
        print(f"Archivo '{name}' no encontrado en {directory}")
        return False
    
    try:
        ruta.unlink()
        print(f"Archivo '{name}' borrado exitosamente")
        return True
    except Exception as e:
        print(f"Error al borrar '{name}': {str(e)}")
        return False