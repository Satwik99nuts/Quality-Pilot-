# API Design

## ShopSphere REST API (Phase 1)

All endpoints fall under the `/api/v1` prefix.

### Authentication (`/auth`)
- `POST /register`: Accepts email and password, creates user and cart.
- `POST /login`: OAuth2 password flow, returns JWT bearer token.
- `POST /logout`: Client-side token invalidation.

### Products (`/products`)
- `GET /`: List all products.
- `GET /{id}`: Retrieve a specific product.
- `GET /categories/`: List product categories.

### Cart (`/cart`)
- `GET /`: Retrieve the current user's cart.
- `POST /items`: Add a product to the cart.
- `PUT /items/{id}`: Modify item quantity.
- `DELETE /items/{id}`: Remove an item.

### Orders (`/orders`)
- `POST /`: Convert cart into a pending order.
- `GET /`: Get order history.
- `GET /{id}`: Get specific order details.

### Users (`/users`)
- `GET /me`: Retrieve profile.
- `PUT /me`: Update profile.
