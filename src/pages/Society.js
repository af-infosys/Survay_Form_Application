import React, { useEffect, useState } from "react";
import apiPath from "../isProduction";
import { useAuth } from "../config/AuthContext";
import { useNavigate } from "react-router-dom";

const Society = () => {
  const [societies, setSocieties] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newAreaName, setNewAreaName] = useState("");
  const [editingArea, setEditingArea] = useState(null); // { id, name } of the area being edited
  const [editAreaName, setEditAreaName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState(""); // For success/error messages after add/edit

  const { user } = useAuth();
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState(null);

  // Function to fetch areas
  const fetchAreas = async () => {
    setLoading(true);
    setError(null);
    try {
      let project = null;

      fetch(`${await apiPath()}/api/work/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then(async (data) => {
          setProjectId(data?.work?._id);
          project = data?.work?._id;
          console.log(data?.work?._id);

          const response = await fetch(
            `${await apiPath()}/api/sheet/areas?workId=${project}`,
          ); // Make sure this matches your backend URL
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result = await response.json();
          setSocieties(result.data); // Set the fetched areas to state
        });
    } catch (err) {
      console.error("Error fetching areas:", err);
      setError("વિસ્તારો લાવવામાં નિષ્ફળ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas(); // Call to fetch areas on component mount
  }, []);

  // Function to handle adding a new area
  const handleAddArea = async () => {
    if (!newAreaName.trim()) {
      setActionMessage("કૃપા કરીને વિસ્તારનું નામ દાખલ કરો.");
      return;
    }

    setLoading(true);
    setActionMessage("");
    try {
      const response = await fetch(`${await apiPath()}/api/sheet/areas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ areaName: newAreaName, workId: projectId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`,
        );
      }

      const result = await response.json();
      setActionMessage(`સફળતાપૂર્વક ઉમેરાયું: ${result.message}`);
      setNewAreaName(""); // Clear input field
      fetchAreas(); // Refresh the list
    } catch (err) {
      console.error("Error adding area:", err);
      setActionMessage(`ઉમેરવામાં નિષ્ફળ: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to open the edit modal
  const openEditModal = (area) => {
    setEditingArea(area);
    setEditAreaName(area.name);
    setIsModalOpen(true);
    setActionMessage(""); // Clear previous messages
  };

  // Function to close the edit modal
  const closeEditModal = () => {
    setIsModalOpen(false);
    setEditingArea(null);
    setEditAreaName("");
  };

  // Function to handle editing an existing area
  const handleEditArea = async () => {
    if (!editAreaName.trim()) {
      setActionMessage("કૃપા કરીને નવું વિસ્તારનું નામ દાખલ કરો.");
      return;
    }
    if (!editingArea || !editingArea.id) {
      setActionMessage("સંપાદિત કરવા માટે કોઈ વિસ્તાર પસંદ કરેલ નથી.");
      return;
    }

    setLoading(true);
    setActionMessage("");
    try {
      const response = await fetch(
        `${await apiPath()}/api/sheet/areas/${editingArea.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newAreaName: editAreaName,
            workId: projectId,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`,
        );
      }

      const result = await response.json();
      setActionMessage(`સફળતાપૂર્વક સંપાદિત થયું: ${result.message}`);
      closeEditModal(); // Close modal on success
      fetchAreas(); // Refresh the list
    } catch (err) {
      console.error("Error editing area:", err);
      setActionMessage(`સંપાદિત કરવામાં નિષ્ફળ: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      {/* Add left margin for desktop sidebar */}
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        સોસાયટી મેનેજમેન્ટ
      </h2>
      {/* Add New Area Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          નવો વિસ્તાર ઉમેરો
        </h3>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="વિસ્તારનું નામ દાખલ કરો"
            value={newAreaName}
            onChange={(e) => setNewAreaName(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            onClick={handleAddArea}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "ઉમેરાઈ રહ્યું છે..." : "ઉમેરો"}
          </button>
        </div>
      </div>
      {/* Action Message Display */}
      {actionMessage && (
        <div
          className={`p-4 mb-6 rounded-lg text-white ${
            actionMessage.includes("નિષ્ફળ") ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {actionMessage}
        </div>
      )}
      {/* List of Societies */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          હાલના વિસ્તારો
        </h3>
        {loading && (
          <p className="text-blue-600">વિસ્તારો લોડ થઈ રહ્યા છે...</p>
        )}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && societies.length === 0 && !error && (
          <p className="text-gray-500">કોઈ વિસ્તારો મળ્યા નથી.</p>
        )}
        <ul className="space-y-3">
          {societies.map((society) => (
            <li
              key={society.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <span className="text-lg font-medium text-gray-800">
                {society.id}. {society.name}
              </span>
              <button
                onClick={() => openEditModal(society)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-all duration-200 ease-in-out transform hover:scale-105"
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-4">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              વિસ્તાર સંપાદિત કરો
            </h3>
            <div className="mb-4">
              <label
                htmlFor="editAreaInput"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                નવું વિસ્તારનું નામ:
              </label>
              <input
                type="text"
                id="editAreaInput"
                value={editAreaName}
                onChange={(e) => setEditAreaName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeEditModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-sm transition-all duration-200 ease-in-out"
                disabled={loading}
              >
                રદ કરો
              </button>
              <button
                onClick={handleEditArea}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "સંપાદિત થઈ રહ્યું છે..." : "સાચવો"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Society;
