import React, { useEffect, useState } from "react";

import { useAuth } from "../config/AuthContext";
import WorkSpot from "../components/WorkSpot";

import "./Profile.scss";

const LOCAL_STORAGE_KEY = "fieldVisibility";

const Profile = () => {
  const { user, logout } = useAuth();

  const [formData, setFormData] = useState({
    ownerName: "",
    occName: "",
    mobileNumber: "",
  });

  // Checkbox states
  const [visibility, setVisibility] = useState({
    showPropertyName: true,
    showOccName: true,
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (saved) {
      setVisibility(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(visibility));
  }, [visibility]);

  // Handle checkbox change
  const handleCheckbox = (e) => {
    const { name, checked } = e.target;

    setVisibility((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <section id="profile">
      <h1>Profile</h1>

      <h2>
        Name : <span>{user?.name}</span>
      </h2>
      <h2>
        Email : <span>{user?.email}</span>
      </h2>

      <button
        style={{
          padding: ".5rem 1.4rem",
          borderRadius: "13px",
          border: "none",
          background: "red",
          color: "white",
          fontSize: "1rem",
          fontWeight: "600",
        }}
        onClick={() => {
          const result = window.confirm("Are you Sure to Logout?");
          if (result) logout();
        }}
      >
        Logout
      </button>

      <hr />
      <br />

      <div className="workspot-container">
        <WorkSpot />
      </div>

      <hr />
      <br />

      <div className="toggle-container">
        <label className="toggle-switch">
          <input
            type="checkbox"
            name="showOccName"
            checked={visibility.showOccName || false}
            onChange={handleCheckbox}
          />

          <span className="slider"></span>
        </label>

        <span className="toggle-label">6. કબ્જેદારનું નામ</span>
      </div>

      <div className="toggle-container">
        <label className="toggle-switch">
          <input
            type="checkbox"
            name="showPropertyName"
            checked={visibility.showPropertyName || false}
            onChange={handleCheckbox}
          />

          <span className="slider"></span>
        </label>

        <span className="toggle-label">9. મિલ્ક્ત પર લખેલ નામ</span>
      </div>
    </section>
  );
};

export default Profile;
