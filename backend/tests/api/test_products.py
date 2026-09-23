def test_get_categories(client):
    response = client.get("/api/v1/products/categories/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2
    names = [c["name"] for c in data]
    assert "Electronics" in names
    assert "Clothing" in names

def test_get_products(client):
    response = client.get("/api/v1/products/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2
    names = [p["name"] for p in data]
    assert "Smartphone" in names
    assert "T-Shirt" in names

def test_get_product_by_id(client):
    # Get all products first to find a valid ID
    products_response = client.get("/api/v1/products/")
    product_id = products_response.json()[0]["id"]
    
    response = client.get(f"/api/v1/products/{product_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == product_id
    assert "name" in data
    assert "price" in data

def test_get_product_not_found(client):
    response = client.get("/api/v1/products/999999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Product not found"
