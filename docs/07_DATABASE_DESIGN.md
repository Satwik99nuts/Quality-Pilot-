# Database Design

## ER Diagram (ShopSphere)

```mermaid
erDiagram
    USERS ||--o{ ORDERS : places
    USERS ||--|| CARTS : owns
    CATEGORIES ||--o{ PRODUCTS : contains
    CARTS ||--o{ CART_ITEMS : holds
    PRODUCTS ||--o{ CART_ITEMS : "added as"
    ORDERS ||--o{ ORDER_ITEMS : contains
    PRODUCTS ||--o{ ORDER_ITEMS : "purchased as"

    USERS {
        int id PK
        string email
        string hashed_password
        string full_name
        boolean is_active
        datetime created_at
    }
    
    CATEGORIES {
        int id PK
        string name
        string description
    }
    
    PRODUCTS {
        int id PK
        string name
        float price
        int stock_quantity
        int category_id FK
    }
    
    CARTS {
        int id PK
        int user_id FK
    }
    
    CART_ITEMS {
        int id PK
        int cart_id FK
        int product_id FK
        int quantity
    }
    
    ORDERS {
        int id PK
        int user_id FK
        string status
        float total_amount
        string shipping_address
    }
    
    ORDER_ITEMS {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        float unit_price
    }
```

## Validation Strategy
When automating tests, database validations will interact with these tables. For example, testing `POST /api/v1/orders` will verify that records are successfully inserted into both `ORDERS` and `ORDER_ITEMS`, and that the `total_amount` matches the sum of the `CART_ITEMS` prior to checkout.
