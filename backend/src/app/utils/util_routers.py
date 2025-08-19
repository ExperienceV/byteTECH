from app.database.queries.threads import get_threads_by_lesson_id
from app.database.config import SessionLocal
from app.database.base import Course
from app.services.services_google import delete_file
from app.parameters import settings
import resend
from app.database.queries.codes import create_code, delete_expired_codes
from sqlalchemy.orm import Session
from app.utils.signature import create_reset_token
from app.database.queries.tokens import save_token



def include_threads(lessons: list) -> list:
    new_list = []
    for lesson in lessons:
        lesson_id = lesson["id"]
        get_threads = get_threads_by_lesson_id(
            db=SessionLocal(),
            lesson_id=lesson_id
        )
    
        lesson["threads"] = get_threads
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
            delete_file(fid) 
        except Exception as e:
            print(f"Error deleting {fid}: {e}")


def resend_mail(message, issue, client_mail, username):
    """
    Function that sends an email using the Resend API.
    
    This function formats the provided message and sends it via email, 
    including information such as the user's name, email, and the issue.
    
    Args:
        message (str): The content of the message to be sent.
        issue (str): The subject of the email.
        client_mail (str): The email address of the client.
        username (str): The username of the client sending the message.
    
    Returns:
        resend.Emails.SendResponse: The response object from the Resend API containing email details.
    
    Raises:
        Exception: If there is an error while sending the email, it will be caught and printed.
    """
    try:
        # Set the Resend API key from the environment variables
        resend.api_key = settings.RESEND_API_KEY

        # Format the message with the user's details
        ident_message = dot_separator(message)
        build_message = f"Hello @{username}!\n{ident_message}"

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
            {settings.FRONTEND_URL}/restore_password?token={token}
            If you did not request a password reset, please ignore this email.
            """,
            issue=f"Reset your password - ByteTech",
            client_mail=email,
            username=username
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
            username=username
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




