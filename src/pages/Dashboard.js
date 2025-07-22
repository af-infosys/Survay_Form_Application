import React from "react";
import { Outlet } from "react-router-dom";
import MenuBar from "../components/MenuBar";

import "./Dashboard.scss";

const Dashboard = () => {
  return (
    <>
      <MenuBar />

      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Dashboard;
