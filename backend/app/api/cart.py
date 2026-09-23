from typing import Any
from fastapi import APIRouter, HTTPException
from app.api.deps import SessionDep, CurrentUser
from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.schemas.cart import Cart as CartSchema, CartItemCreate, CartItemUpdate, CartItem as CartItemSchema

router = APIRouter()

@router.get("/", response_model=CartSchema)
def get_cart(session: SessionDep, current_user: CurrentUser) -> Any:
    cart = session.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart:
        # Create one if missing for some reason
        cart = Cart(user_id=current_user.id)
        session.add(cart)
        session.commit()
        session.refresh(cart)
    return cart

@router.post("/items", response_model=CartItemSchema)
def add_item_to_cart(session: SessionDep, current_user: CurrentUser, item_in: CartItemCreate) -> Any:
    cart = session.query(Cart).filter(Cart.user_id == current_user.id).first()
    
    product = session.query(Product).filter(Product.id == item_in.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.stock_quantity < item_in.quantity:
        raise HTTPException(status_code=400, detail="Not enough stock")
        
    # Check if item already exists in cart
    existing_item = session.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.product_id == item_in.product_id
    ).first()
    
    if existing_item:
        existing_item.quantity += item_in.quantity
        session.commit()
        session.refresh(existing_item)
        return existing_item
        
    cart_item = CartItem(
        cart_id=cart.id,
        product_id=item_in.product_id,
        quantity=item_in.quantity
    )
    session.add(cart_item)
    session.commit()
    session.refresh(cart_item)
    return cart_item

@router.put("/items/{item_id}", response_model=CartItemSchema)
def update_cart_item(session: SessionDep, current_user: CurrentUser, item_id: int, item_in: CartItemUpdate) -> Any:
    cart = session.query(Cart).filter(Cart.user_id == current_user.id).first()
    cart_item = session.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id == cart.id).first()
    
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
        
    cart_item.quantity = item_in.quantity
    session.commit()
    session.refresh(cart_item)
    return cart_item

@router.delete("/items/{item_id}")
def remove_cart_item(session: SessionDep, current_user: CurrentUser, item_id: int) -> Any:
    cart = session.query(Cart).filter(Cart.user_id == current_user.id).first()
    cart_item = session.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id == cart.id).first()
    
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
        
    session.delete(cart_item)
    session.commit()
    return {"message": "Item removed from cart"}
