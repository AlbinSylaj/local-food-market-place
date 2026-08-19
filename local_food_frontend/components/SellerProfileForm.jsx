import React, { useState, useEffect } from "react";
import axios from "axios";
import "../src/assets/styles/Forms.css";
function SellerProfileForm() {
  const [formData, setFormData] = useState({
    bio: "",
    profile_picture: null,
  });

  const [loading, setLoading] = useState(false);

  // Handle text input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file input
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profile_picture: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("bio", formData.bio);
    if (formData.profile_picture) {
      data.append("profile_picture", formData.profile_picture);
    }

    axios.post("http://127.0.0.1:8000/api/seller_profile/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        alert("Seller profile updated successfully!");
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error updating seller profile:", error);
        alert("Failed to update profile.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "20px auto" }}>
      <h2>Seller Profile</h2>
      <textarea
        name="bio"
        placeholder="Write your bio..."
        value={formData.bio}
        onChange={handleChange}
        style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
      />
      <input
        type="file"
        name="profile_picture"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "block", margin: "10px 0" }}
      />
      <button type="submit" disabled={loading} style={{ padding: "10px 15px", marginTop: "10px" }}>
        {loading ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}

export default SellerProfileForm;
