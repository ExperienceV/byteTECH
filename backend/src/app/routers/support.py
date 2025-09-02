from fastapi import APIRouter, HTTPException, status, Form
from fastapi.responses import HTMLResponse
from app.utils.util_routers import resend_mail
from app.models import form_model

# Create an instance of FastAPI's APIRouter
support_router = APIRouter(prefix="/support", tags=["support"])

@support_router.post("/send_email", response_class=HTMLResponse)
async def send_email(
    name: str = Form(...),
    mail: str = Form(...),
    issue: str = Form(...),
    message: str = Form(...)
):
    """
ira flaco, este no esta complicao solo dropeame esos parametros de ahi saludos a la family
    """
    
    # Attempt to send the email using the form data
    response = resend_mail(
        username=name,
        client_mail=mail,
        issue=issue,
        message=message
    )

    # If email sending fails, raise an HTTPException with status 405
    if not response:
        raise HTTPException(
            status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
            detail='Ooops, mail sending failed'
        )

    # If both operations succeed, return a success message with status 200
    raise HTTPException(
        status_code=status.HTTP_200_OK,
        detail='Everything is fine.'
    )