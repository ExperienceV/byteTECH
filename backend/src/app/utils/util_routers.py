from app.database.queries.threads import get_threads_by_lesson_id
from app.database.session import retry_db_operation
from app.database.base import Course
from app.utils.storage import delete_file
from app.parameters import settings
import resend
from app.database.queries.codes import create_code, delete_expired_codes
from sqlalchemy.orm import Session
from app.utils.signature import create_reset_token
from app.database.queries.tokens import save_token
import ffmpeg
import tempfile
import math
import os

@retry_db_operation(max_retries=2, delay=0.3)
def include_threads(lessons: list, db_session=None) -> list:
    """
    Include threads for lessons using the provided database session
    to avoid creating multiple connections
    """
    if not db_session:
        raise ValueError("Database session is required")
    
    new_list = []
    for lesson in lessons:
        lesson_id = lesson["id"]
        try:
            get_threads = get_threads_by_lesson_id(
                db=db_session,
                lesson_id=lesson_id
            )
            lesson["threads"] = get_threads
        except Exception as e:
            # Log the error but don't fail the entire operation
            print(f"Warning: Failed to get threads for lesson {lesson_id}: {e}")
            lesson["threads"] = []
        
        new_list.append(lesson)

    return new_list


def get_all_drive_ids(course: Course):
    # Inicializar lista con los archivos del propio curso
    drive_ids = []
    if course.miniature_id:
        drive_ids.append(course.miniature_id)
    if course.video_id:
        drive_ids.append(course.video_id)

    # Agregar los archivos de cada lección del curso
    for lesson in course.lessons:
        if lesson.file_id:
            drive_ids.append(lesson.file_id)

    return drive_ids


def delete_drive_files(file_ids: list[str]):
    for fid in file_ids:
        try:
            delete_file(name=fid) 
        except Exception as e:
            print(f"Error deleting {fid}: {e}")


def resend_mail(message, issue, client_mail, username, is_restore_or_verify:bool=False):
    """
    Function that sends an email using the Resend API.
    
    This function formats the provided message and sends it via email, 
    including information such as the user's name, email, and the issue.
    
    Args:
        message (str): The content of the message to be sent.
        issue (str): The subject of the email.
        client_mail (str): The email address of the client.
        username (str): The username of the client sending the message.
        is_restore (bool, optional): Whether the email is for password restoration. Defaults to False.
    
    Returns:
        resend.Emails.SendResponse: The response object from the Resend API containing email details.
    
    Raises:
        Exception: If there is an error while sending the email, it will be caught and printed.
    """
    try:
        # Set the Resend API key from the environment variables
        resend.api_key = settings.RESEND_API_KEY

        if is_restore_or_verify:
            # Format the message with the user's details
            ident_message = dot_separator(message)
            build_message = message
        else:
            # Format the message with the user's details
            ident_message = dot_separator(message)
            build_message = f"El usuario @{username} con el correo {client_mail} envio un mensaje con el asunto {issue}.\n{ident_message}"

        # Prepare the email parameters
        params: resend.Emails.SendParams = {
            "from": settings.SENDER_MAIL,
            "to": client_mail if client_mail else settings.RECEIVER_MAIL ,
            "subject": issue,
            "text": build_message
        }

        # Send the email using Resend API and return the response
        email = resend.Emails.send(params)
        return email
    except Exception as e:
        # Print any errors that occur during email sending
        print(e)


def dot_separator(text):
    """
    Function that formats a message by replacing '. ' with a newline.
    
    This is useful for separating different parts of the message to 
    make it more readable when sent via email.
    
    Args:
        text (str): The text message to be formatted.
    
    Returns:
        str: The formatted message with line breaks where appropriate.
    """
    # Replace '. ' with '.\n' to separate sentences
    modify_text = text.replace('. ', '.\n')
    
    # Ensure the message ends with a newline if it ends with a period
    if modify_text.endswith('.'):
        modify_text += '\n'
    
    return modify_text


def process_code(
        db: Session,
        user_id: int = None,
        email: str = None,
        username: str = None,
        is_restore: bool = False
):
    # Create verification code/token
    if is_restore:
        token: str = create_reset_token(data={"user_id": user_id, "email": email})
        if not token:
            response={
                "status": 500,
                "message": "Failed to create token"
            }
            return response
        
        save_response = save_token(
            db=db,
            user_id=user_id,
            token=token
        )

        if not save_response:
            response={
                "status": 500,
                "message": "Failed to save token"
            }
            return response
    else:
        code = create_code(
            db=db,
            user_id=user_id
        )

        if not code:
            response={
                "status": 500,
                "message": "Failed to create code"
                }
            return response
    
    # Delete expired codes
    delete_expired_codes(db=db)

    # Send code or Url to the email
    if is_restore:
        send_mail_response = resend_mail(
            message=f"""
            We received a request to reset your password.
            To proceed with resetting your password, please use the following URL:
            {settings.FRONTEND_URL}/auth/reset-password?token={token}
            If you did not request a password reset, please ignore this email.
            """,
            issue=f"Reset your password - ByteTech",
            client_mail=email,
            username=username,
            is_restore_or_verify=True
        )
    else:
        send_mail_response = resend_mail(
            message=f"""
            Welcome to ByteTech!
            Thank you for registering with us. 
            To verify your email address and activate your account, please enter the following verification code:
            {code.code}
            """,
            issue=f"Your verification code - {code.code}",
            client_mail=email,
            username=username,
            is_restore_or_verify=True
        )

    if not send_mail_response:
        response={
            "status": 500,
            "message": "Failed to send email"
            }

    response={
        "status": 200,
        "value": code.code if not is_restore else token,
        }
    
    return response




async def get_video_duration_minutes(contents: bytes) -> int:
    if not contents:
        raise ValueError("El contenido del video está vacío.")
    
    with tempfile.NamedTemporaryFile(delete=True, suffix=".mp4") as temp:
        temp.write(contents)
        temp.flush()

        size = os.path.getsize(temp.name)
        if size == 0:
            raise ValueError("El archivo temporal está vacío.")

        try:
            probe = ffmpeg.probe(temp.name)
            duration_sec = float(probe['format']['duration'])
        except ffmpeg.Error as e:
            raise RuntimeError(f"Error al analizar el video con ffprobe: {e.stderr.decode()}")

    return math.floor(duration_sec / 60)


async def mkv_to_mp4_bytes(contents: bytes) -> bytes:
    """
    Transcode MKV bytes to MP4 (H.264 + AAC) and return the resulting MP4 bytes.
    Uses temporary files with ffmpeg for reliability.
    """
    if not contents:
        raise ValueError("El contenido MKV está vacío.")

    with tempfile.NamedTemporaryFile(delete=True, suffix=".mkv") as in_file, \
         tempfile.NamedTemporaryFile(delete=True, suffix=".mp4") as out_file:
        in_file.write(contents)
        in_file.flush()

        # Ensure input size > 0
        if os.path.getsize(in_file.name) == 0:
            raise ValueError("El archivo temporal de entrada está vacío.")

        # 1) Intentar REMUX (copia de streams) si los codecs ya son compatibles con MP4 (p.ej., H.264 + AAC)
        remux_ok = False
        try:
            (
                ffmpeg
                .input(in_file.name)
                .output(out_file.name, c='copy', movflags='faststart')
                .overwrite_output()
                .run(quiet=True)
            )
            remux_ok = True
        except ffmpeg.Error:
            remux_ok = False

        if not remux_ok:
            # 2) Fallback: transcodificar usando libopenh264 + aac (más disponible que libx264 en algunos builds)
            try:
                (
                    ffmpeg
                    .input(in_file.name)
                    .output(out_file.name, vcodec='libopenh264', acodec='aac', movflags='faststart')
                    .overwrite_output()
                    .run(quiet=True)
                )
            except ffmpeg.Error as e:
                raise RuntimeError(
                    "Error al convertir MKV a MP4 con ffmpeg (remux y transcode fallaron): "
                    + getattr(e, 'stderr', b'').decode(errors='ignore')
                )

        # Read output mp4 bytes
        out_file.seek(0)
        return out_file.read()

