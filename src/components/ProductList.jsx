import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/styles/ProductList.css";

function ProductList({ addToCart, canBuy }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/products/")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <div className="product-container">
      <h2 className="section-title">Available Products</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            {product.image && (
              <img
                src={
                  product.image.startsWith("http")
                    ? product.image
                    : `http://127.0.0.1:8000${product.image}`
                }
                alt={product.name}
                className="product-image"
              />
            )}
            <h3 className="product-name">{product.name}</h3>
            <p className="product-category">{product.category}</p>
            <p className="product-description">{product.description}</p>
            <p className="product-price">€{product.price}</p>
            <p className="product-quantity">Quantity: {product.quantity}</p>
            <button
              className="add-cart-btn"
              onClick={() => addToCart(product)}
              disabled={!canBuy}
            >
              {canBuy ? "Add to Cart" : "Login to Buy"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
