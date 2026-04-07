from fastapi import APIRouter, HTTPException
from ..schemas import ComparisonCreate, ComparisonResponse, ComparisonGenerateRequest
from ..db import supabase
from ..services.content import generate_comparison

router = APIRouter(prefix="/comparisons", tags=["Comparisons"])


@router.get("/", response_model=list[ComparisonResponse])
async def list_comparisons():
    """List all active comparisons (for the index page)."""
    try:
        res = (
            supabase.table("comparisons")
            .select("*")
            .eq("status", "active")
            .order("created_at", desc=True)
            .execute()
        )
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{slug}", response_model=ComparisonResponse)
async def get_comparison(slug: str):
    """Get a single comparison by slug."""
    try:
        res = (
            supabase.table("comparisons")
            .select("*")
            .eq("slug", slug)
            .eq("status", "active")
            .single()
            .execute()
        )
        return res.data
    except Exception as e:
        raise HTTPException(status_code=404, detail="Comparison not found")


@router.post("/", response_model=ComparisonResponse)
async def create_comparison(comparison: ComparisonCreate):
    """Create a new comparison."""
    try:
        data = comparison.model_dump(exclude_none=True)
        res = supabase.table("comparisons").insert(data).execute()
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate", response_model=ComparisonCreate)
async def generate_comparison_endpoint(req: ComparisonGenerateRequest):
    """Use AI to generate comparison data without saving to DB yet (preview mode)."""
    try:
        data = await generate_comparison(
            product_a_name=req.product_a_name,
            product_b_name=req.product_b_name,
            extra_info=req.extra_info
        )
        if not data:
            raise HTTPException(status_code=500, detail="Failed to generate comparison content")
        
        # Merge defaults if needed
        data["status"] = "active"
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
