from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
import os
import stripe

payment_router = APIRouter()

STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "tu_clave_secreta_de_stripe")
stripe.api_key = STRIPE_SECRET_KEY

@payment_router.post("/stripe/create-payment-intent")
async def create_payment_intent(request: Request):
    data = await request.json()
    amount = data.get("amount")
    currency = data.get("currency", "usd")
    if not amount:
        raise HTTPException(status_code=400, detail="Amount is required")
    try:
        intent = stripe.PaymentIntent.create(
            amount=int(amount),
            currency=currency,
            automatic_payment_methods={"enabled": True},
        )
        return {"clientSecret": intent.client_secret}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
