import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import SignupForm from "../components/SignUpForm.jsx";
import LoginForm from "../components/LoginForm.jsx";
import SellerProfileForm from "../components/SellerProfileForm.jsx";
import ProductForm from "../components/ProductForm.jsx";
import ProductList from "../components/ProductList.jsx";
import BuyerCart from "../components/BuyerCart.jsx";
import "./assets/styles/ElegantTheme.css";

function App() {
  const [cart, setCart] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  function handleAuthSuccess(authData) {
    setUserRole(authData.role);
    setUserDetails({
      username: authData.username,
      email: authData.email || "Not provided",
      role: authData.role,
    });
  }

  function addToCart(product) {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  }

  function removeFromCart(productId) {
    setCart(cart.filter((item) => item.id !== productId));
  }

  return (
    <Router>
      <nav>
        <div className="logo">Local Foods</div>
        <div className="links">
          <Link to="/">Marketplace</Link>
          {!userRole ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          ) : userRole === "buyer" ? (
            <>
              <Link to="/cart">Cart</Link>
              <Link to="/account">Account: {userDetails?.username}</Link>
            </>
          ) : (
            <>
              <Link to="/add-product">Add Product</Link>
              <Link to="/seller-profile">Seller Profile</Link>
              <Link to="/account">Account: {userDetails?.username}</Link>
            </>
          )}
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <section className="hero">
                  <h1 className="hero-title">Discover Fresh Local Products</h1>
                  <p className="hero-subtitle">Support local sellers and enjoy quality goods.</p>
                  <Link to="/signup" className="hero-btn">Join Now</Link>
                </section>
                <div className="card">
                  <ProductList addToCart={addToCart} canBuy={userRole === "buyer"} />
                </div>
              </div>
            }
          />
          <Route
            path="/signup"
            element={
              <div className="card">
                <SignupForm onAuthSuccess={handleAuthSuccess} />
              </div>
            }
          />
          <Route
            path="/login"
            element={
              <div className="card">
                <LoginForm onAuthSuccess={handleAuthSuccess} />
              </div>
            }
          />
          <Route
            path="/account"
            element={userRole ? (
              <div className="card">
                <h2>Account Details</h2>
                <p>Username: {userDetails?.username}</p>
                <p>Email: {userDetails?.email}</p>
                <p>Role: {userDetails?.role}</p>
              </div>
            ) : <Navigate to="/login" replace />}
          />
          <Route
            path="/seller-profile"
            element={userRole === "seller" ? (
              <div className="card">
                <SellerProfileForm />
              </div>
            ) : <Navigate to="/login" replace />}
          />
          <Route
            path="/add-product"
            element={userRole === "seller" ? (
              <div className="card">
                <ProductForm />
              </div>
            ) : <Navigate to="/login" replace />}
          />
          <Route
            path="/cart"
            element={userRole === "buyer" ? (
              <div className="card">
                <BuyerCart cartItems={cart} removeFromCart={removeFromCart} />
              </div>
            ) : <Navigate to="/login" replace />}
          />
        </Routes>
      </div>

      <footer className="footer">
  <div className="footer-content">
    <p className="footer-logo">Local Foods</p>
    <div className="footer-links">
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
      <Link to="/terms">Terms</Link>
    </div>
    <p className="footer-copy">© {new Date().getFullYear()} Local Foods. All rights reserved.</p>
  </div>
</footer>

    </Router>
  );
}

export default App;
