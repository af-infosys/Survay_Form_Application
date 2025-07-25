import React, { useState, useEffect } from "react";
import apiPath from "../isProduction";
import { useAuth } from "../config/AuthContext";
import { useNavigate } from "react-router-dom";
import WorkSpot from "../components/WorkSpot";
import "./SurvayReport.scss"; // CSS ને હવે ઇનલાઇન કરવામાં આવ્યું છે

const SurvayReport = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const { user } = useAuth();

  const fetchRecords = async () => {
    try {
      const response = await fetch(`${await apiPath()}/api/sheet`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setRecords(result.data); // result.data માંથી રેકોર્ડ્સ સેટ કરો
    } catch (err) {
      console.error("Error fetching records:", err);
      setError("ડેટા લાવવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Google Sheets અને Inter ફોન્ટ માટે CDN સ્ક્રિપ્ટો ઉમેરો
    const addExternalScripts = () => {
      const tailwindScript = document.createElement("script");
      tailwindScript.src = "https://cdn.tailwindcss.com";
      document.head.appendChild(tailwindScript);

      const interFontLink = document.createElement("link");
      interFontLink.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
      interFontLink.rel = "stylesheet";
      document.head.appendChild(interFontLink);
    };

    addExternalScripts();

    fetchRecords();

    // કમ્પોનન્ટ અનમાઉન્ટ થાય ત્યારે સ્ક્રિપ્ટોને સાફ કરો
    return () => {
      const tailwindScript = document.querySelector(
        'script[src="https://cdn.tailwindcss.com"]'
      );
      if (tailwindScript) document.head.removeChild(tailwindScript);
      const interFontLink = document.querySelector('link[href*="Inter"]');
      if (interFontLink) document.head.removeChild(interFontLink);
    };
  }, []); // કમ્પોનન્ટ માઉન્ટ થાય ત્યારે ફક્ત એક જ વાર ચલાવો

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700">
        ડેટા લોડ થઈ રહ્યો છે...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        Error: {error}
      </div>
    );
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`${await apiPath()}/api/sheet/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setRecords(records.filter((record) => record.id !== id));

      fetchRecords();
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* ઇનલાઇન CSS */}
      <style>
        {`
          body {
            font-family: "Inter", sans-serif;
            background-color: #f0f2f5;
          }
          .container {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 2rem;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          }
          .table-container {
            overflow-x: auto; /* કોષ્ટકને રિસ્પોન્સિવ બનાવવા માટે */
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 12px 16px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
          }
          th {
            background-color: #f9fafb;
            font-weight: 600;
            color: #4b5563;
            text-transform: uppercase;
            font-size: 0.75rem;
            letter-spacing: 0.05em;
          }
          tbody tr:nth-child(even) {
            background-color: #f3f4f6; /* વૈકલ્પિક પંક્તિઓ માટે શેડિંગ */
          }
          tbody tr:hover {
            background-color: #e5e7eb; /* હોવર ઇફેક્ટ */
          }
          .rounded-tl-lg { border-top-left-radius: 0.5rem; }
          .rounded-tr-lg { border-top-right-radius: 0.5rem; }
          .rounded-bl-lg { border-bottom-left-radius: 0.5rem; }
          .rounded-br-lg { border-bottom-right-radius: 0.5rem; }
        `}
      </style>

      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        સર્વેયર રજીસ્ટર
      </h1>
      <h2 className="text-xl text-center mb-8 text-gray-600">
        સન ૨૦૨૫–૨૬ ના વર્ષ માટેના વેરાપાત્ર હોય તેવા મકાનો જમીનનો આકારણી ની યાદી
        - મોજે:- પીપરડી
      </h2>

      <WorkSpot />
      <br />

      <div className="table-container rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                અનું કૂમાંક
              </th>
              <th
                className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ minWidth: "150px" }}
              >
                માલિકનું નામ
              </th>
              <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                વિસ્તારનું નામ
              </th>
              <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                મિલ્કત ક્રમાંક
              </th>
              <th
                className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ minWidth: "300px" }}
              >
                મિલકતનું વર્ણન
              </th>
              <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                મોબાઈલ નંબર
              </th>

              <th
                className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ rotate: "90deg", transform: "translateY(2px)" }}
              >
                નળ
              </th>
              <th
                className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ rotate: "90deg", transform: "translateY(10px)" }}
              >
                શૌચાલય
              </th>
              <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                રીમાર્કસ/નોંધ
              </th>
              <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((record, index) => {
              let survayorData = record[16];

              if (typeof survayorData === "string") {
                try {
                  survayorData = JSON.parse(survayorData);
                } catch (error) {
                  console.error("Error parsing survayor data:", error);
                  survayorData = null;
                }
              }

              return (
                <tr key={index}>
                  {/* અહીં Google Sheet માંથી આવતા ડેટાને કૉલમમાં મેપ કરો */}
                  <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record[0]}
                  </td>{" "}
                  {/* અનું કૂમાંક (serialNumber) */}
                  <td className="px-2 py-4 whitespace-normal text-sm text-gray-500">
                    {record[3]}
                  </td>{" "}
                  {/* વિસ્તારનું નામ (areaName) */}
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record[1]}
                  </td>{" "}
                  {/* મિલ્કત ક્રમાંક (propertyNumber) */}
                  <td className="px-2 py-4 whitespace-normal text-sm text-gray-500">
                    {record[2]}
                  </td>{" "}
                  {/* મિલકતનું વર્ણન (description) */}
                  <td className="px-2 py-4 whitespace-normal text-sm text-gray-500">
                    {record[15]}
                  </td>{" "}
                  {/* માલિકનું નામ (ownerName) */}
                  <td className="px-2 py-4 whitespace-normal text-sm text-gray-500">
                    {record[5]}
                  </td>
                  {/* કબ્જેદારનું નામ (rowData માં નથી) */}
                  {/* <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500"></td> */}
                  {/* આકારેલી વેરાની રકમ (rowData માં નથી) */}
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record[11]}
                  </td>{" "}
                  {/* પાણી નો નળ (tapCount) */}
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record[12]}
                  </td>{" "}
                  {/* શૌચાલય (toiletCount) */}
                  <td className="px-2 py-4 whitespace-normal text-sm text-gray-500">
                    {record[13]}
                  </td>{" "}
                  {/* રીમાર્કસ/નોંધ (remarks) */}
                  {user.id === survayorData?.id ? (
                    <td
                      className="px-2 py-4 whitespace-normal text-sm text-gray-500"
                      style={{
                        display: "flex",
                        gap: ".5rem",
                        height: "100%",
                      }}
                    >
                      <button
                        onClick={() => navigate(`/form/${record[0]}`)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(record[0])}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  ) : (
                    <td className="px-2 py-4 whitespace-normal text-sm text-gray-500">
                      Added by <br /> {survayorData?.name || "Unknown"}
                    </td>
                  )}
                </tr>
              );
            })}

            {records.length === 0 && !loading && !error && (
              <tr>
                <td
                  colSpan="11"
                  className="px-6 py-4 text-center text-gray-500"
                >
                  કોઈ રેકોર્ડ ઉપલબ્ધ નથી.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SurvayReport;
