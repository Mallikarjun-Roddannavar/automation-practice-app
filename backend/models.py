from typing import Literal
from datetime import date
from pydantic import BaseModel, Field

Role = Literal['admin', 'shopper']
class AppUser(BaseModel):
    username: str
    role: Role
class ProductInput(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: str = Field(default='', max_length=500)
    price: float = Field(gt=0, le=1000000, allow_inf_nan=False)
class CartItem(BaseModel):
    product_id: int
    quantity: int = Field(gt=0, le=100)
class Checkout(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    address: str = Field(min_length=1, max_length=500)
    items: list[CartItem] = Field(min_length=1, max_length=100)
    gift_wrap: bool = False
    delivery_method: Literal['standard', 'express'] = 'standard'
    delivery_date: date | None = None
    attachment_name: str | None = Field(default=None, max_length=255)
    attachment_base64: str | None = Field(default=None, max_length=1400000)
class OrderStatus(BaseModel):
    status: Literal['Placed', 'Processing', 'Completed']
