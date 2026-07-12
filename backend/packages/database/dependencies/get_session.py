from sqlalchemy.ext.asyncio import AsyncSession
from packages.database.session import AsyncSessionLocal

async def get_session():
    async with AsyncSessionLocal() as session:
        yield session