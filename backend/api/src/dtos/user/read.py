from fastapi_users import schemas
import uuid

class UserRead(schemas.BaseUser[uuid.UUID]):
    pass