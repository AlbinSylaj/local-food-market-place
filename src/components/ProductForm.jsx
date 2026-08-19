import React, { useState } from "react";
import axios from "axios";
import "../src/assets/styles/Forms.css";
function ProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    quantity: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("quantity", formData.quantity);
    if (formData.image) {
      data.append("image", formData.image);
    }

    axios.post("http://127.0.0.1:8000/api/products/", data, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    })
      .then((response) => {
        alert("Product created successfully!");
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error creating product:", error);
        alert("Failed to create product.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "20px auto" }}>
      <h2>Add New Product</h2>
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={formData.name}
        onChange={handleChange}
        required
        style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
      />
      <input
        type="text"
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
        required
        style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
      />
      <input
        type="number"
        name="price"
        placeholder="Price (€)"
        value={formData.price}
        onChange={handleChange}
        required
        style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
      />
      <input
        type="number"
        name="quantity"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={handleChange}
        required
        style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
      />
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "block", margin: "10px 0" }}
      />
      <button type="submit" disabled={loading} style={{ padding: "10px 15px", marginTop: "10px" }}>
        {loading ? "Saving..." : "Add Product"}
      </button>
    </form>
  );
}

export default ProductForm;
