# Development only
from .engine import engine
from packages.database.models.base import Base

def create_tables():
    with engine.begin() as conn:
        Base.metadata.create_all(bind=conn)
