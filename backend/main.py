from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

from app.routers import content, tracking, products, webhooks

app = FastAPI(title="High-Velocity Affiliate Automation Platform API")

# CORS setup
origins = [
    "http://localhost:3000",  # Next.js frontend
    "http://localhost",
    "http://127.0.0.1",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(content.router)
app.include_router(tracking.router)
app.include_router(webhooks.router)

@app.get("/")
async def root():
    return {"message": "Affiliate Automation Platform API is running"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}
