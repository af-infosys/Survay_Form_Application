import React, { useEffect, useState } from "react";
import apiPath from "../isProduction";
import { useAuth } from "../config/AuthContext";

const WorkSpot = () => {
  const [workSpot, setWorkSpot] = useState({});

  const { user } = useAuth();

  useEffect(() => {
    const fetchWorkSpot = async () => {
      try {
        fetch(`${await apiPath()}/api/work/${user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setWorkSpot(data?.work?.spot);
          });

        setWorkSpot(user.workSpot);
      } catch (err) {
        console.log(err);
      }
    };

    fetchWorkSpot();
  }, []);

  return (
    <h3 className="text-xl font-bold text-center text-gray-800 mb-4">
      <p>ગામ: {workSpot?.gaam}</p>
      <p>તાલુકો: {workSpot?.taluka}</p>
      <p>જિલ્લો: {workSpot?.district}</p>
    </h3>
  );
};

export default WorkSpot;
