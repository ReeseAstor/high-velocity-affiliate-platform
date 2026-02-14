from fastapi import APIRouter, Request, HTTPException
from ..schemas import ProductCreate
from ..db import supabase

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])

@router.post("/make/product")
async def handle_make_product_webhook(product: ProductCreate):
    """
    Endpoint for Make.com to push new product data.
    """
    try:
        res = supabase.table("products").insert(product.dict()).execute()
        return {"status": "success", "product_id": res.data[0]['id']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
