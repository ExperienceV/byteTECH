from __future__ import print_function
import os.path
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload, MediaIoBaseDownload
from google.auth.transport.requests import Request
from fastapi import UploadFile
import io

SCOPES = ['https://www.googleapis.com/auth/drive.file']  # Acceso solo a archivos creados por tu app


def authenticate():
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)

        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    
    return creds


def upload_file(file: UploadFile):
    creds = authenticate()
    service = build('drive', 'v3', credentials=creds)

    # Obtener extensión del archivo
    _, ext = os.path.splitext(file.filename)

    # Subir archivo a Drive
    media = MediaIoBaseUpload(file.file, mimetype=file.content_type, resumable=True)
    file_metadata = {"name": file.filename}
    file = service.files().create(body=file_metadata, media_body=media, fields="id").execute()
    
    file_id = file.get("id")
    print(f"Archivo subido con ID: {file_id}")

    # Renombrar archivo usando su ID
    new_name = f"{file_id}{ext}"
    updated = service.files().update(
        fileId=file_id,
        body={"name": new_name}
    ).execute()

    print(f"Archivo renombrado a: {updated['name']}")
    return file_id


def delete_file(file_id: str):
    try:
        creds = authenticate()
        service = build('drive', 'v3', credentials=creds)

        service.files().delete(fileId=file_id).execute()

        return True
    except Exception as e:
        print(f"error {str(e)}")
        return True

def download_file_from_drive(file_id: str) -> tuple[bytes, str, str]:
    """
    Descarga un archivo de Google Drive y retorna:
    - El contenido en bytes
    - El nombre del archivo
    - El tipo MIME
    """
    creds = authenticate()
    service = build("drive", "v3", credentials=creds)

    # Obtener metadatos (nombre y tipo MIME)
    file_metadata = service.files().get(
        fileId=file_id,
        fields="name, mimeType"
    ).execute()

    file_name = file_metadata["name"]
    mime_type = file_metadata["mimeType"]

    # Descargar el archivo
    request = service.files().get_media(fileId=file_id)
    fh = io.BytesIO()
    downloader = MediaIoBaseDownload(fh, request)

    done = False
    while not done:
        status, done = downloader.next_chunk()

    fh.seek(0)  # Volver al inicio
    return fh.read(), file_name, mime_type
