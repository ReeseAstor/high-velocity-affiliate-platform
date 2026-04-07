from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# Network Schemas
class NetworkBase(BaseModel):
    name: str
    api_endpoint: Optional[str] = None
    postback_url: Optional[str] = None

class NetworkCreate(NetworkBase):
    pass

class NetworkResponse(NetworkBase):
    id: str
    created_at: datetime
    class Config:
        from_attributes = True


# Product Schemas
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    affiliate_url: str
    network_id: Optional[str] = None
    commission_rate: Optional[float] = 0
    metadata: Optional[dict] = {}
    status: Optional[str] = "active"

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    class Config:
        from_attributes = True


# Content Schemas
class ContentBase(BaseModel):
    title: str
    slug: Optional[str] = None
    body_markdown: Optional[str] = None
    status: str = "draft"
    meta_description: Optional[str] = None

class ContentCreate(ContentBase):
    product_id: str

class ContentResponse(ContentBase):
    id: str
    product_id: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    class Config:
        from_attributes = True


# Tracking Schemas
class ClickCreate(BaseModel):
    product_id: str
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    referer: Optional[str] = None

class ClickResponse(BaseModel):
    id: str
    click_id: str
    created_at: datetime
    class Config:
        from_attributes = True


# Comparison Schemas
class ComparisonBase(BaseModel):
    slug: str
    title: str
    subtitle: Optional[str] = None
    meta_description: Optional[str] = None
    product_a: dict
    product_b: dict
    winner: str = "A"
    winner_reason: Optional[str] = None
    categories: list = []
    faqs: list = []
    verdict_summary: Optional[str] = None
    status: str = "active"

class ComparisonCreate(ComparisonBase):
    pass

class ComparisonGenerateRequest(BaseModel):
    product_a_name: str
    product_b_name: str
    extra_info: Optional[str] = ""

class ComparisonResponse(ComparisonBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    class Config:
        from_attributes = True
