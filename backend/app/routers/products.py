from fastapi import APIRouter, HTTPException
from ..schemas import ProductCreate, ProductResponse
from ..db import supabase

router = APIRouter(prefix="/products", tags=["Products"])

@router.post("/", response_model=ProductResponse)
async def create_product(product: ProductCreate):
    try:
        data = product.model_dump(exclude_none=True)
        res = supabase.table("products").insert(data).execute()
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=list[ProductResponse])
async def list_products():
    try:
        res = supabase.table("products").select("*").order("created_at", desc=True).execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    try:
        res = supabase.table("products").select("*").eq("id", product_id).single().execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=404, detail="Product not found")
