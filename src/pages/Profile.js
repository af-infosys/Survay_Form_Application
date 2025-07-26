import React from "react";

import { useAuth } from "../config/AuthContext";
import WorkSpot from "../components/WorkSpot";

import "./Profile.scss";

const Profile = () => {
  const { user, logout } = useAuth();

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
    </section>
  );
};

export default Profile;
