from __future__ import print_function
import os.path
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google.auth.transport.requests import Request


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


def upload_file(file_path):
    creds = authenticate()
    service = build('drive', 'v3', credentials=creds)

    original_name = os.path.basename(file_path)

    file_metadata = {'name': original_name}
    media = MediaFileUpload(file_path, resumable=True)
    file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
    
    file_id = file.get('id')
    print(f"Archivo subido con ID: {file_id}")

    new_name = f"{file_id}{os.path.splitext(file_path)[1]}"
    updated_file = service.files().update(
        fileId=file_id,
        body={"name": new_name}
    ).execute()

    print(f"Archivo renombrado a: {updated_file['name']}")
    return file_id


def delete_file(file_id):
    creds = authenticate()
    service = build('drive', 'v3', credentials=creds)

    service.files().delete(fileId=file_id).execute()

    return True
