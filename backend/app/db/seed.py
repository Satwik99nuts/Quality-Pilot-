import os
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, Base, engine
from app.models.product import Category, Product

def seed_db():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    print("Seeding database with test data...")
    db: Session = SessionLocal()
    try:
        # Check if already seeded
        if db.query(Category).first():
            print("Database already seeded.")
            return

        cat1 = Category(name="Electronics", description="Gadgets")
        cat2 = Category(name="Clothing", description="Apparel")
        db.add_all([cat1, cat2])
        db.flush()
        
        prod1 = Product(name="Smartphone", description="A cool phone", price=699.99, stock_quantity=10, category_id=cat1.id)
        prod2 = Product(name="T-Shirt", description="Cotton t-shirt", price=19.99, stock_quantity=50, category_id=cat2.id)
        db.add_all([prod1, prod2])
        db.commit()
        print("Database seeded successfully.")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
