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

        cat1 = Category(name="Electronics", description="Gadgets and tech")
        cat2 = Category(name="Clothing", description="Apparel and fashion")
        cat3 = Category(name="Home", description="Home goods and decor")
        db.add_all([cat1, cat2, cat3])
        db.flush()
        
        products = [
            # ELECTRONICS (cat1)
            Product(name="Smartphone X", description="Latest generation smartphone with pro camera system.", price=999.99, stock_quantity=45, image_url="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80", category_id=cat1.id),
            Product(name="Wireless Earbuds", description="Noise-cancelling wireless earbuds with 24h battery.", price=149.99, stock_quantity=120, image_url="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80", category_id=cat1.id),
            Product(name="4K Smart TV", description="55-inch 4K UHD Smart TV with HDR10+.", price=499.99, stock_quantity=15, image_url="https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80", category_id=cat1.id),
            Product(name="Gaming Laptop", description="High performance gaming laptop with RTX 4070.", price=1299.99, stock_quantity=8, image_url="https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80", category_id=cat1.id),
            Product(name="Mechanical Keyboard", description="RGB mechanical keyboard with tactile switches.", price=89.99, stock_quantity=60, image_url="https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80", category_id=cat1.id),
            Product(name="Wireless Mouse", description="Ergonomic wireless mouse with precision tracking.", price=49.99, stock_quantity=80, image_url="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80", category_id=cat1.id),
            Product(name="Smart Watch", description="Fitness tracking smartwatch with heart rate monitor.", price=199.99, stock_quantity=30, image_url="https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80", category_id=cat1.id),
            Product(name="Bluetooth Speaker", description="Portable waterproof bluetooth speaker.", price=79.99, stock_quantity=50, image_url="https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80", category_id=cat1.id),
            Product(name="Tablet Pro", description="11-inch tablet with stylus support for creators.", price=649.99, stock_quantity=20, image_url="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80", category_id=cat1.id),
            Product(name="VR Headset", description="Next-gen virtual reality standalone headset.", price=399.99, stock_quantity=12, image_url="https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80", category_id=cat1.id),

            # CLOTHING (cat2)
            Product(name="Classic T-Shirt", description="Premium cotton blend t-shirt, everyday comfort.", price=24.99, stock_quantity=200, image_url="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80", category_id=cat2.id),
            Product(name="Denim Jeans", description="Slim fit blue denim jeans.", price=59.99, stock_quantity=85, image_url="https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80", category_id=cat2.id),
            Product(name="Running Shoes", description="Lightweight running shoes for all terrains.", price=89.99, stock_quantity=40, image_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80", category_id=cat2.id),
            Product(name="Winter Jacket", description="Waterproof winter jacket with thermal lining.", price=129.99, stock_quantity=25, image_url="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80", category_id=cat2.id),
            Product(name="Leather Belt", description="Genuine leather belt with classic buckle.", price=34.99, stock_quantity=110, image_url="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80", category_id=cat2.id),
            Product(name="Silk Scarf", description="Elegant silk scarf with floral patterns.", price=29.99, stock_quantity=60, image_url="https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80", category_id=cat2.id),
            Product(name="Sunglasses", description="Polarized sunglasses with UV protection.", price=49.99, stock_quantity=75, image_url="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80", category_id=cat2.id),
            Product(name="Formal Shirt", description="Crisp white formal shirt for office wear.", price=44.99, stock_quantity=90, image_url="https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=800&q=80", category_id=cat2.id),
            Product(name="Yoga Pants", description="Stretchable and breathable yoga pants.", price=39.99, stock_quantity=150, image_url="https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80", category_id=cat2.id),
            Product(name="Sneakers", description="Casual everyday sneakers in white.", price=69.99, stock_quantity=65, image_url="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80", category_id=cat2.id),

            # HOME (cat3)
            Product(name="Coffee Maker", description="Programmable drip coffee maker.", price=45.00, stock_quantity=30, image_url="https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80", category_id=cat3.id),
            Product(name="Desk Lamp", description="LED desk lamp with wireless charging base.", price=35.50, stock_quantity=60, image_url="https://images.unsplash.com/photo-1534281329624-9df2499d7990?w=800&q=80", category_id=cat3.id),
            Product(name="Scented Candle", description="Lavender scented soy wax candle.", price=18.99, stock_quantity=100, image_url="https://images.unsplash.com/photo-1602874801007-bd458cb6c975?w=800&q=80", category_id=cat3.id),
            Product(name="Throw Blanket", description="Soft knitted throw blanket for the couch.", price=29.99, stock_quantity=45, image_url="https://images.unsplash.com/photo-1580828369019-2228b4faea1a?w=800&q=80", category_id=cat3.id),
            Product(name="Ceramic Mug", description="Handcrafted ceramic coffee mug.", price=14.99, stock_quantity=80, image_url="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80", category_id=cat3.id),
            Product(name="Wall Clock", description="Minimalist silent wall clock.", price=22.50, stock_quantity=40, image_url="https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&q=80", category_id=cat3.id),
            Product(name="Plant Pot", description="Modern indoor ceramic plant pot.", price=19.99, stock_quantity=70, image_url="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80", category_id=cat3.id),
            Product(name="Bookshelf", description="3-tier wooden bookshelf.", price=85.00, stock_quantity=15, image_url="https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80", category_id=cat3.id),
            Product(name="Throw Pillow", description="Decorative velvet throw pillow.", price=16.99, stock_quantity=90, image_url="https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?w=800&q=80", category_id=cat3.id),
            Product(name="Air Purifier", description="HEPA air purifier for bedrooms.", price=119.99, stock_quantity=25, image_url="https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80", category_id=cat3.id)
        ]
        db.add_all(products)
        
        # Seed Test Suites
        from app.models.test_suite import TestSuite
        suite1 = TestSuite(name="Unit Tests", description="Fast, isolated logic tests", suite_type="unit")
        suite2 = TestSuite(name="API Integration Tests", description="Tests for backend endpoints", suite_type="api")
        suite3 = TestSuite(name="E2E UI Tests", description="Full browser tests using Playwright", suite_type="e2e")
        db.add_all([suite1, suite2, suite3])
        
        db.commit()
        print("Database seeded successfully.")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
