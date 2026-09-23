def test_get_cart_unauthorized(client):
    response = client.get("/api/v1/cart/")
    assert response.status_code == 401

def test_get_cart_authorized(authorized_client):
    response = authorized_client.get("/api/v1/cart/")
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "items" in data
    assert len(data["items"]) == 0

def test_add_item_to_cart(authorized_client, client):
    # First get a valid product
    products_response = client.get("/api/v1/products/")
    product_id = products_response.json()[0]["id"]
    
    # Add to cart
    response = authorized_client.post(
        "/api/v1/cart/items",
        json={"product_id": product_id, "quantity": 2}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["product_id"] == product_id
    assert data["quantity"] == 2
    
    # Verify it's in the cart
    cart_response = authorized_client.get("/api/v1/cart/")
    cart_data = cart_response.json()
    assert len(cart_data["items"]) == 1
    assert cart_data["items"][0]["quantity"] == 2

def test_add_item_insufficient_stock(authorized_client, client):
    products_response = client.get("/api/v1/products/")
    product = products_response.json()[0]
    
    response = authorized_client.post(
        "/api/v1/cart/items",
        json={"product_id": product["id"], "quantity": product["stock_quantity"] + 10}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Not enough stock"

def test_add_nonexistent_product(authorized_client):
    response = authorized_client.post(
        "/api/v1/cart/items",
        json={"product_id": 999999, "quantity": 1}
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Product not found"

def test_update_cart_item(authorized_client, client):
    # Add item first
    products_response = client.get("/api/v1/products/")
    product_id = products_response.json()[0]["id"]
    
    add_response = authorized_client.post(
        "/api/v1/cart/items",
        json={"product_id": product_id, "quantity": 1}
    )
    item_id = add_response.json()["id"]
    
    # Update quantity
    update_response = authorized_client.put(
        f"/api/v1/cart/items/{item_id}",
        json={"quantity": 5}
    )
    assert update_response.status_code == 200
    assert update_response.json()["quantity"] == 5

def test_remove_cart_item(authorized_client, client):
    # Add item first
    products_response = client.get("/api/v1/products/")
    product_id = products_response.json()[0]["id"]
    
    add_response = authorized_client.post(
        "/api/v1/cart/items",
        json={"product_id": product_id, "quantity": 1}
    )
    item_id = add_response.json()["id"]
    
    # Remove item
    delete_response = authorized_client.delete(f"/api/v1/cart/items/{item_id}")
    assert delete_response.status_code == 200
    
    # Verify cart is empty
    cart_response = authorized_client.get("/api/v1/cart/")
    assert len(cart_response.json()["items"]) == 0

def test_update_nonexistent_cart_item(authorized_client):
    response = authorized_client.put(
        "/api/v1/cart/items/999999",
        json={"quantity": 5}
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Cart item not found"
