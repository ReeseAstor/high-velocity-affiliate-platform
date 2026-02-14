import uuid
from ..db import supabase

def generate_click_id() -> str:
    # Use UUID or ULID for unique click IDs
    return str(uuid.uuid4())

async def track_click(click_id: str, product_id: str, ip: str, user_agent: str, referrer: str):
    data = {
        "click_id": click_id,
        "product_id": product_id,
        "visitor_ip": ip,
        "user_agent": user_agent,
        "referrer": referrer
    }
    try:
        response = supabase.table("clicks").insert(data).execute()
        return response
    except Exception as e:
        print(f"Error tracking click: {e}")
        return None

async def record_conversion(click_id: str, amount: float, transaction_id: str):
    data = {
        "click_id": click_id,
        "amount": amount,
        "transaction_id": transaction_id
    }
    try:
        # Verify click_id exists first? Or rely on foreign key constraint error.
        response = supabase.table("conversions").insert(data).execute()
        return response
    except Exception as e:
        print(f"Error recording conversion: {e}")
        return None
