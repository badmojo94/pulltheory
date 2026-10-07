from dotenv import load_dotenv
from pathlib import Path
load_dotenv(Path(__file__).parent / '.env')

import os
import logging
from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware

from db import client, db
from auth import auth_router
from shop import shop_router
from seed import seed

app = FastAPI(title="The Pull Theory API")

api_router = APIRouter(prefix="/api")


@api_router.get("/")
async def root():
    return {"message": "The Pull Theory API"}


app.include_router(api_router)
app.include_router(auth_router)
app.include_router(shop_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def on_startup():
    await seed()
    logger.info("Seed complete")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
