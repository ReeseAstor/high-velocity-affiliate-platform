from fastapi import APIRouter, Request, HTTPException, BackgroundTasks
from fastapi.responses import RedirectResponse
from ..db import supabase
import uuid

router = APIRouter(tags=["Tracking"])

def generate_click_id() -> str:
    return str(uuid.uuid4())[:8]

async def track_click(click_id: str, product_id: str, ip: str, user_agent: str, referer: str):
    try:
        supabase.table("clicks").insert({
            "click_id": click_id,
            "product_id": product_id,
            "ip_address": ip,
            "user_agent": user_agent,
            "referer": referer
        }).execute()
    except Exception as e:
        print(f"Error tracking click: {e}")

@router.get("/go/{product_id}")
async def track_redirect(product_id: str, request: Request, background_tasks: BackgroundTasks):
    try:
        res = supabase.table("products").select("affiliate_url").eq("id", product_id).single().execute()
        affiliate_url = res.data['affiliate_url']
    except Exception as e:
        raise HTTPException(status_code=404, detail="Product not found")

    click_id = generate_click_id()
    separator = "&" if "?" in affiliate_url else "?"
    final_link = f"{affiliate_url}{separator}subid={click_id}"

    ip = request.client.host
    user_agent = request.headers.get("user-agent", "")
    referer = request.headers.get("referer", "")
    background_tasks.add_task(track_click, click_id, product_id, ip, user_agent, referer)

    return RedirectResponse(url=final_link)

@router.post("/postback")
async def handle_postback(click_id: str, amount: float = 0, transaction_id: str = ""):
    try:
        # Look up the click to get the product_id
        click_res = supabase.table("clicks").select("product_id").eq("click_id", click_id).single().execute()
        product_id = click_res.data['product_id']

        supabase.table("conversions").insert({
            "click_id": click_id,
            "product_id": product_id,
            "payout": amount,
            "status": "confirmed"
        }).execute()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
