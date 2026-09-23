from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from .product import Product

class CartItemBase(BaseModel):
    product_id: int
    quantity: int

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: int

class CartItem(CartItemBase):
    id: int
    cart_id: int
    product: Optional[Product] = None
    
    class Config:
        from_attributes = True

class CartBase(BaseModel):
    pass

class Cart(CartBase):
    id: int
    user_id: int
    items: List[CartItem] = []
    
    class Config:
        from_attributes = True
