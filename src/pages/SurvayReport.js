import React, { useState, useEffect, useMemo } from "react";
import apiPath from "../isProduction";
import { useAuth } from "../config/AuthContext";
import { useNavigate } from "react-router-dom";
import WorkSpot from "../components/WorkSpot";
import "./SurvayReport.scss"; // CSS ને હવે ઇનલાઇન કરવામાં આવ્યું છે

const SurvayReport = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectId, setProjectId] = useState(null);

  const navigate = useNavigate();

  const { user } = useAuth();

  const fetchRecords = async () => {
    let project = null;

    try {
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

          // setWorkSpot(user.workSpot);
          // } catch (err) {
          //   console.log(err);
          //   return;
          // }

          // try {
          const response = await fetch(
            `${await apiPath()}/api/sheet?workId=${projectId || project}`,
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result = await response.json();
          setRecords(result.data); // result.data માંથી રેકોર્ડ્સ સેટ કરો
        });
    } catch (err) {
      console.error("Error fetching records:", err);
      setError("ડેટા લાવવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.");
    } finally {
      setLoading(false);
    }
  };
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const HOUSE_CATEGORIES = [
    "રહેણાંક",
    "દુકાન",
    "ધાર્મિક સ્થળ",
    "સરકારી મિલ્ક્ત",
    "પ્રાઈવેટ - સંસ્થાઓ",
    "પ્લોટ ખાનગી - ખુલ્લી જગ્યા",
    "પ્લોટ સરકારી - કોમનપ્લોટ",
    "કારખાના - ઇન્ડસ્ટ્રીજ઼",
    "ટ્રસ્ટ મિલ્કત / NGO",
    "મંડળી - સેવા સહકારી મંડળી",
    "બેંક - સરકારી",
    "બેંક - અર્ધ સરકારી બેંક",
    "બેંક - પ્રાઇટ બેંક",
    "સરકારી સહાય આવાસ",
    "કોમ્પપ્લેક્ષ",
    "હિરાના કારખાના નાના",
    "હિરાના કારખાના મોટા",
    "મોબાઈલ ટાવર",
    "પેટ્રોલ પંપ, ગેસ પંપ",
  ];

  const LOCAL_STORAGE_KEY = "survayReportFilters";

  const getInitialState = () => {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedState) {
      try {
        return JSON.parse(savedState);
      } catch (e) {
        console.error("Error parsing stored state:", e);
        // Fallback to default state if parsing fails
      }
    }
    return {
      searchTerm: "",
      areaFilter: "",
      categoryFilter: "",
      isSorted: false,
      isReversed: false,
    };
  };

  const initialState = useMemo(() => getInitialState(), []);
  const [searchTerm, setSearchTerm] = useState(initialState.searchTerm);
  const [areaFilter, setAreaFilter] = useState(initialState.areaFilter);
  const [categoryFilter, setCategoryFilter] = useState(
    initialState.categoryFilter,
  );
  const [isSorted, setIsSorted] = useState(initialState.isSorted);
  const [isReversed, setIsReversed] = useState(initialState.isReversed);
  const [isConfirming, setIsConfirming] = useState(null); // For custom delete confirmation

  // --- Persistence Effect (Saving filters to localStorage) ---
  useEffect(() => {
    const filters = {
      searchTerm,
      areaFilter,
      categoryFilter,
      isSorted,
      isReversed,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filters));
  }, [searchTerm, areaFilter, categoryFilter, isSorted, isReversed]);

  // --- Filtering, Searching, and Sorting Logic ---
  const getFilteredAndSortedRecords = useMemo(() => {
    let filteredRecords = records;

    // 1. Search Filter (Owner Name (3), Mobile (5), Remarks (13))
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      filteredRecords = filteredRecords.filter((record) => {
        const ownerName = record[3]?.toLowerCase() || "";
        const mobile = record[5]?.toLowerCase() || "";
        const remarks = record[13]?.toLowerCase() || "";

        return (
          ownerName.includes(lowerCaseSearch) ||
          mobile.includes(lowerCaseSearch) ||
          remarks.includes(lowerCaseSearch)
        );
      });
    }

    // 2. Area Filter (Index 1)
    if (areaFilter) {
      filteredRecords = filteredRecords.filter(
        (record) => record[1] === areaFilter,
      );
    }

    // 3. Category Filter (Index 7)
    if (categoryFilter) {
      filteredRecords = filteredRecords.filter(
        (record) => record[7] === categoryFilter,
      );
    }

    // 4. Sorting (Owner Name - Index 3)
    if (isSorted) {
      // Create a shallow copy before sorting
      filteredRecords = [...filteredRecords].sort((a, b) => {
        const nameA = a[3] || "";
        const nameB = b[3] || "";
        return nameA.localeCompare(nameB, "gu", { sensitivity: "base" });
      });
    }

    // 5. Reverse Order
    if (isReversed) {
      // Create a shallow copy before reversing
      filteredRecords = [...filteredRecords].reverse();
    }

    return filteredRecords;
  }, [records, searchTerm, areaFilter, categoryFilter, isSorted, isReversed]);

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
      console.log("Attempting to delete record with ID:", id);

      // passing projectId as workId in body
      await fetch(`${await apiPath()}/api/sheet/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          workId: projectId,
        }),
      });
      setRecords([]);

      fetchRecords();
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  const background = "rgb(59 130 246)";
  const finalRecords = getFilteredAndSortedRecords;

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
        - By A.F. Infosys
      </h2>

      <WorkSpot />
      <br />

      {/* --- Search and Filter Controls --- */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center">
          {/* <Search size={20} className="mr-2 text-blue-600"/>  */}
          Search & Filter Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 1. Universal Search Bar */}
          <div className="md:col-span-2 relative">
            <input
              type="text"
              placeholder="માલિક, મોબાઈલ, કે નોંધ/રીમાર્કસ શોધો..."
              className="input-style w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/> */}
          </div>

          {/* 2. Area Filter Dropdown (Index 1) */}
          <div className="select-wrapper">
            <select
              className="input-style appearance-none w-full pr-10"
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
            >
              <option value="">All Areas</option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Category Filter Dropdown (Index 7) */}
          <div className="select-wrapper">
            <select
              className="input-style appearance-none w-full pr-10"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Category</option>
              {HOUSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sorting and Reverse Controls */}
        <div className="flex flex-wrap items-center mt-4 pt-4 border-t border-gray-200 gap-6">
          <p className="font-semibold text-sm text-gray-600">Other Options:</p>

          {/* 4. Sorting Checkbox (Owner Name - Ascending) */}
          <label className="flex items-center space-x-2 cursor-pointer text-sm text-gray-700">
            <input
              type="checkbox"
              checked={isSorted}
              onChange={(e) => setIsSorted(e.target.checked)}
              className="form-checkbox h-4 w-4 text-blue-600 rounded"
            />
            <span>Sort A-Z</span>
          </label>

          {/* 5. Reverse Order Checkbox */}
          <label className="flex items-center space-x-2 cursor-pointer text-sm text-gray-700">
            <input
              type="checkbox"
              checked={isReversed}
              onChange={(e) => setIsReversed(e.target.checked)}
              className="form-checkbox h-4 w-4 text-red-600 rounded"
            />
            <span>Reverse</span>
          </label>

          {/* Status */}
          <div className="ml-auto text-sm font-medium text-gray-500">
            કુલ રેકોર્ડ્સ: {finalRecords.length} / {records.length}
          </div>
        </div>
      </div>

      <div className="table-container rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg"
                style={{ padding: "5px 8px", textAlign: "center" }}
                id="thead"
              >
                અનું કૂમાંક
              </th>

              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                id="thead"
                style={{
                  minWidth: "150px",

                  padding: "5px 8px",
                  textAlign: "center",
                }}
              >
                માલિકનું નામ
              </th>

              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ padding: "5px 8px", textAlign: "center" }}
                id="thead"
              >
                વિસ્તારનું નામ
              </th>

              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ padding: "5px 8px", textAlign: "center" }}
                id="thead"
              >
                મિલ્કત ક્રમાંક
              </th>

              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                id="thead"
                style={{
                  minWidth: "300px",

                  padding: "5px 8px",
                  textAlign: "center",
                }}
              >
                મિલકતનું વર્ણન
              </th>

              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg"
                style={{ padding: "5px 8px", textAlign: "center" }}
                id="thead"
              >
                બિ.પ.
              </th>

              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ padding: "5px 8px", textAlign: "center" }}
                id="thead"
              >
                મોબાઈલ નંબર
              </th>

              <th
                className="text-xs font-medium text-gray-500 lowercase tracking-wider"
                style={{ padding: "5px 8px", textAlign: "center" }}
                id="thead"
              >
                મકાન category
              </th>

              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ padding: "5px 8px", textAlign: "center" }}
                id="thead"
              >
                નળ
              </th>

              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ padding: "5px 8px", textAlign: "center" }}
                id="thead"
              >
                શૌચાલય
              </th>

              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{
                  padding: "5px 8px",
                  textAlign: "center",
                  minWidth: "140px",
                }}
                id="thead"
              >
                નોંધ/રીમાર્કસ
              </th>

              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg"
                id="thead"
                style={{
                  minWidth: "130px",
                  padding: "5px 8px",
                  textAlign: "center",
                }}
              >
                Action
              </th>
            </tr>
          </thead>

          {/* Index Start */}
          <tr>
            {/* 1 to 18 th for index */}
            {Array.from({ length: 12 }).map((_, index) => (
              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{
                  textAlign: "center",
                  color: "white",
                  background: background,
                  padding: "3px",
                }}
                key={index}
              >
                {index + 1}
              </th>
            ))}
          </tr>
          {/* Index End */}

          <tbody className="bg-white divide-y divide-gray-200">
            {finalRecords.map((record, index) => {
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
                  {/* Index Number */}
                  <td
                    className="whitespace-nowrap text-sm font-medium text-gray-900"
                    style={{ padding: "3px 8px" }}
                  >
                    {record[0]}
                  </td>
                  {/* Owner Name */}
                  <td
                    className="whitespace-normal text-sm text-gray-500"
                    style={{ padding: "3px 8px" }}
                  >
                    {record[3]}
                  </td>{" "}
                  {/* Area Name */}
                  <td
                    className="whitespace-nowrap text-sm text-gray-500"
                    style={{ padding: "3px 8px" }}
                  >
                    {record[1]}
                  </td>{" "}
                  {/* Property Index */}
                  <td
                    className="whitespace-normal text-sm text-gray-500"
                    style={{ padding: "3px 8px" }}
                  >
                    {record[2]}
                  </td>
                  {/* Property Description */}
                  <td
                    className="whitespace-normal text-sm text-gray-500"
                    style={{ padding: "3px 8px" }}
                  >
                    {record[15]}
                  </td>
                  {/* B.P. */}
                  <td
                    className="whitespace-normal text-sm text-gray-500"
                    style={{ padding: "3px 8px" }}
                  >
                    {record[13]?.includes("બિ.પ.") ? "બિ.પ." : ""}
                  </td>
                  {/* Mobile Number */}
                  <td
                    className="whitespace-normal text-sm text-gray-500"
                    style={{ padding: "3px 8px" }}
                  >
                    {record[5]}
                  </td>
                  {/* Category */}
                  <td
                    className="whitespace-nowrap text-sm text-gray-500"
                    style={{ padding: "3px 8px" }}
                  >
                    {record[7]}
                  </td>
                  {/* Tap Connections */}
                  <td
                    className="whitespace-nowrap text-sm text-gray-500"
                    style={{ padding: "3px 8px" }}
                  >
                    {record[11]}
                  </td>
                  {/* Bathroom */}
                  <td
                    className="whitespace-nowrap text-sm text-gray-500"
                    style={{ padding: "3px 8px" }}
                  >
                    {record[12]}
                  </td>
                  {/* Notes/Remarks */}
                  <td
                    className="whitespace-normal text-sm text-gray-500"
                    style={{ padding: "3px 8px", minWidth: "140px" }}
                  >
                    {record[13]}
                  </td>
                  {/* Surveryor name & Action Buttons */}
                  {user.id === survayorData?.id ? (
                    <td
                      className="whitespace-normal text-sm text-gray-500"
                      style={{
                        display: "flex",
                        gap: ".5rem",
                        height: "100%",
                        padding: "3px 8px",
                      }}
                    >
                      <button
                        onClick={() => navigate(`/form/${record[0]}`)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (
                            !window.confirm(
                              `ID = '${record[0]}' \nAre you Sure to Delete this Record?`,
                            )
                          )
                            return;

                          handleDelete(record[0]);
                        }}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  ) : (
                    <td
                      className="whitespace-normal text-gray-500"
                      style={{
                        fontSize: ".7rem",
                        padding: "3px 8px",
                        minWidth: "200px",
                      }}
                    >
                      Added by <br />{" "}
                      <b style={{ fontSize: ".8rem" }}>
                        {survayorData?.name || "Unknown"}
                      </b>
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
