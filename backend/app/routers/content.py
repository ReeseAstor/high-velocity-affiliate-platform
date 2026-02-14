from fastapi import APIRouter, HTTPException
from ..schemas import ContentResponse
from ..db import supabase

router = APIRouter(prefix="/content", tags=["Content"])

@router.post("/generate", response_model=ContentResponse)
async def create_content(product_id: str, title: str = "Generated Review"):
    """Generate content for a product. OpenAI integration is optional."""
    try:
        content_data = {
            "product_id": product_id,
            "title": title,
            "slug": title.lower().replace(" ", "-"),
            "body_markdown": f"# {title}\n\nContent generation placeholder. Configure your OpenAI API key to enable AI-generated reviews.",
            "meta_description": f"Review of product {product_id}",
            "status": "draft"
        }
        res = supabase.table("content").insert(content_data).execute()
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=list[ContentResponse])
async def list_content():
    try:
        res = supabase.table("content").select("*").order("created_at", desc=True).execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
