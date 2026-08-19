import React from "react";
import "../src/assets/styles/BuyerCart.css";

function BuyerCart({ cartItems, removeFromCart }) {
  const cart = cartItems;

  // Calculate total
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto" }}>
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                borderBottom: "1px solid #ddd",
                paddingBottom: "5px",
              }}
            >
              {item.image && (
                <img
                  src={
                    item.image.startsWith("http")
                      ? item.image
                      : `http://127.0.0.1:8000${item.image}`
                  }
                  alt={item.name}
                  className="cart-product-image"
                />
              )}
              <span>
                {item.name} (x{item.quantity})
              </span>
              <span>€{item.price * item.quantity}</span>
              <button
                onClick={() => removeFromCart(item.id)}
                style={{ marginLeft: "10px" }}
              >
                Remove
              </button>
            </div>
          ))}
          <h3>Total: €{total}</h3>
        </div>
      )}
    </div>
  );
}

export default BuyerCart;
