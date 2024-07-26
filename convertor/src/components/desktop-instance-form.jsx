import React, { useState } from "react";
import axios from "axios";
import apiURL from "../api_url";
import "../style/desktop-instance-form.css";
import { useNavigate } from "react-router-dom";

export default function DesktopInstanceForm() {
  const navigate = useNavigate();
  const api_url = apiURL();
  // console.log(process.env);
  // console.log(api_url);

  const [formData, setFormData] = useState({
    url: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send the data to the server
    axios
      .post(`${api_url}/connectToEngine`, formData)
      .then((response) => {
        if (response.data.status === 1) return navigate("/hub");
        console.log(response.data.msg);
      })
      .catch((error) => {
        console.error("There was an error sending the data:", error);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={{ display: "grid" }}>
        <div className="input-container">
          <label>Connection URL</label>
          <input
            type="text"
            name="url"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        {formData.url.length === 0 ? (
          <button type="submit" disabled className="r-btn r-btn-disabled">
            Submit
          </button>
        ) : (
          <button type="submit" className="r-btn r-btn-active">
            Submit
          </button>
        )}
      </form>
    </>
  );
}
