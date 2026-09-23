from typing import Any, List
from fastapi import APIRouter, HTTPException
from app.api.deps import SessionDep, CurrentUser
from app.models.order import Order, OrderItem
from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.schemas.order import Order as OrderSchema, OrderCreate

router = APIRouter()

@router.post("/", response_model=OrderSchema)
def create_order(session: SessionDep, current_user: CurrentUser, order_in: OrderCreate) -> Any:
    cart = session.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty")
        
    total_amount = 0.0
    for item in cart.items:
        total_amount += item.product.price * item.quantity
        
    order = Order(
        user_id=current_user.id,
        shipping_address=order_in.shipping_address,
        total_amount=total_amount,
        status="pending"
    )
    session.add(order)
    session.flush() # To get order.id
    
    for item in cart.items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=item.product.price
        )
        session.add(order_item)
        
    # Clear the cart
    session.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
    
    session.commit()
    session.refresh(order)
    return order

@router.get("/", response_model=List[OrderSchema])
def get_orders(session: SessionDep, current_user: CurrentUser) -> Any:
    orders = session.query(Order).filter(Order.user_id == current_user.id).all()
    return orders

@router.get("/{order_id}", response_model=OrderSchema)
def get_order(session: SessionDep, current_user: CurrentUser, order_id: int) -> Any:
    order = session.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
