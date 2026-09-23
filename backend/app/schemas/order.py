from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .product import Product

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    
class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int
    order_id: int
    unit_price: float
    
    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    shipping_address: str

class OrderCreate(OrderBase):
    pass

class Order(OrderBase):
    id: int
    user_id: int
    status: str
    total_amount: float
    created_at: datetime
    items: List[OrderItem] = []
    
    class Config:
        from_attributes = True
