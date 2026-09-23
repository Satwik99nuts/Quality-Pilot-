from typing import Any, List
from fastapi import APIRouter, HTTPException
from app.api.deps import SessionDep
from app.models.product import Product, Category
from app.schemas.product import Product as ProductSchema, Category as CategorySchema

router = APIRouter()

@router.get("/", response_model=List[ProductSchema])
def get_products(session: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    products = session.query(Product).offset(skip).limit(limit).all()
    return products

@router.get("/{id}", response_model=ProductSchema)
def get_product(session: SessionDep, id: int) -> Any:
    product = session.query(Product).filter(Product.id == id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/categories/", response_model=List[CategorySchema])
def get_categories(session: SessionDep) -> Any:
    categories = session.query(Category).all()
    return categories
