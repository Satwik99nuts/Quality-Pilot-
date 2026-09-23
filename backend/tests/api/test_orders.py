def test_create_order_empty_cart(authorized_client):
    response = authorized_client.post(
        "/api/v1/orders/",
        json={"shipping_address": "123 Main St"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Cart is empty"

def test_create_order_success(authorized_client, client):
    # 1. Add item to cart
    products_response = client.get("/api/v1/products/")
    product = products_response.json()[0]
    
    authorized_client.post(
        "/api/v1/cart/items",
        json={"product_id": product["id"], "quantity": 2}
    )
    
    # 2. Create order
    response = authorized_client.post(
        "/api/v1/orders/",
        json={"shipping_address": "123 Main St"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert data["shipping_address"] == "123 Main St"
    assert data["status"] == "pending"
    assert len(data["items"]) == 1
    assert data["items"][0]["quantity"] == 2
    assert data["total_amount"] == product["price"] * 2
    
    # 3. Verify cart is emptied
    cart_response = authorized_client.get("/api/v1/cart/")
    assert len(cart_response.json()["items"]) == 0

def test_get_orders(authorized_client, client):
    # Add to cart and create order
    products_response = client.get("/api/v1/products/")
    product_id = products_response.json()[0]["id"]
    
    authorized_client.post(
        "/api/v1/cart/items",
        json={"product_id": product_id, "quantity": 1}
    )
    
    authorized_client.post(
        "/api/v1/orders/",
        json={"shipping_address": "456 Side St"}
    )
    
    # Get all orders
    response = authorized_client.get("/api/v1/orders/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    
    addresses = [order["shipping_address"] for order in data]
    assert "456 Side St" in addresses

def test_get_specific_order(authorized_client, client):
    # Add to cart and create order
    products_response = client.get("/api/v1/products/")
    product_id = products_response.json()[0]["id"]
    
    authorized_client.post(
        "/api/v1/cart/items",
        json={"product_id": product_id, "quantity": 1}
    )
    
    order_response = authorized_client.post(
        "/api/v1/orders/",
        json={"shipping_address": "789 Backend Blvd"}
    )
    order_id = order_response.json()["id"]
    
    # Get specific order
    response = authorized_client.get(f"/api/v1/orders/{order_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == order_id
    assert data["shipping_address"] == "789 Backend Blvd"

def test_get_nonexistent_order(authorized_client):
    response = authorized_client.get("/api/v1/orders/999999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Order not found"
