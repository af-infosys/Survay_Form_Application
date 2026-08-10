import React, { useState, useEffect, useMemo, useRef } from "react";
import apiPath from "../isProduction";
import { useAuth } from "../config/AuthContext";
import { useNavigate } from "react-router-dom";
import WorkSpot from "../components/WorkSpot";
import "./SurvayReport.scss"; // CSS ને હવે ઇનલાઇન કરવામાં આવ્યું છે
import DelayedImage from "../components/DelayedImage";
import { ReceiptRussianRuble, Search } from "lucide-react";

const SurvayReport = () => {
  const tableRef = useRef(null);
  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const scrollLeft = e.target.scrollLeft;

    localStorage.setItem("scrollTop", scrollTop);
    localStorage.setItem("scrollLeft", scrollLeft);
  };

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

          const response = await fetch(
            `${await apiPath()}/api/sheet?workId=${projectId || project}`,
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result = await response.json();
          setRecords(result.data);

          setTimeout(() => {
            const savedScrollTop = localStorage.getItem("scrollTop");
            const savedScrollLeft = localStorage.getItem("scrollLeft");

            if (tableRef.current && savedScrollTop) {
              tableRef.current.scrollTop = Number(savedScrollTop);
            }
            if (tableRef.current && savedScrollLeft) {
              tableRef.current.scrollLeft = Number(savedScrollLeft);
            }
          }, 900);
        });
    } catch (err) {
      console.error("Error fetching records:", err);
      setError("ડેટા લાવવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.");
    } finally {
      setLoading(false);
    }
  };
  const [areas, setAreas] = useState([]);

  const fetchAreas = async () => {
    try {
      if (!projectId) return;

      const response = await fetch(
        `${await apiPath()}/api/sheet/areas?workId=${projectId}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setAreas(result.data);
      console.log(result.data);
    } catch (err) {
      console.error("Error fetching areas:", err);
    }
  };

  useEffect(() => {
    fetchAreas();
    fetchRecords();
  }, [projectId]);

  const HOUSE_CATEGORIES = [
    "રહેણાંક - મકાન",
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
      isNew: false,
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
  const [isNew, setIsNew] = useState(initialState.isNew); // For  "Is New Property" checkbox

  const [isConfirming, setIsConfirming] = useState(null); // For custom delete confirmation

  // --- Persistence Effect (Saving filters to localStorage) ---
  useEffect(() => {
    const filters = {
      searchTerm,
      areaFilter,
      categoryFilter,
      isSorted,
      isReversed,
      isNew,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filters));
  }, [searchTerm, areaFilter, categoryFilter, isSorted, isReversed, isNew]);

  // --- Filtering, Searching, and Sorting Logic ---
  const getFilteredAndSortedRecords = useMemo(() => {
    let filteredRecords = records;

    // 1. Search Filter (Owner Name (3), Mobile (5), Remarks (13))
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      filteredRecords = filteredRecords.filter((record) => {
        const mId1 = Number(record[0]);
        const mId2 = Number(record[2]);
        const ownerName = record[3]?.toLowerCase() || "";
        const mobile = record[5]?.toLowerCase() || "";
        const remarks = record[13]?.toLowerCase() || "";

        return (
          mId1.toString().includes(lowerCaseSearch) ||
          mId2.toString().includes(lowerCaseSearch) ||
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
        (record) => record[8] === categoryFilter,
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

    // 6. New Records Filter (Index 24)
    if (isNew) {
      filteredRecords = filteredRecords.filter((record) => {
        if (isNew === true) {
          return (
            record[24] === true ||
            record[24] === "true" ||
            record[24] === "TRUE"
          );
        } else {
          return true; // If isNew is false, include all records
        }
      });
    }

    return filteredRecords;
  }, [
    records,
    searchTerm,
    areaFilter,
    categoryFilter,
    isSorted,
    isReversed,
    isNew,
  ]);

  const [imageAkarni, setImageAkarni] = useState(false);
  const [isMobile, setMobileShow] = useState(false);

  useEffect(() => {
    const fetchImageMode = async () => {
      try {
        const res = await fetch(
          `${await apiPath()}/api/valuation/getImageMode/${user.id}?workId=${projectId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        const data = await res.json();
        console.log("Image Mode: ", data);
        setImageAkarni(data?.isImage);
        setMobileShow(data?.isMobile || true);
      } catch (err) {
        console.log("Image Catched", err);
        setImageAkarni(false);
      }
    };

    if (user?.id) {
      // Only run if user ID is available
      fetchImageMode();
    }
  }, [user?.id, projectId]);

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
            background-color: #f3f4f6; 
          }
          tbody tr:hover {
            background-color: #e5e7eb;
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
              style={{ paddingBlock: "5px" }}
            />
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>

          {/* 2. Area Filter Dropdown (Index 1) */}
          <div className="select-wrapper">
            <select
              className="input-style appearance-none w-full pr-10"
              value={areaFilter}
              onChange={(e) => {
                setAreaFilter(e.target.value);
              }}
            >
              <option value="">All Areas</option>
              {areas?.map((area) => (
                <option key={area?.id} value={area?.name}>
                  {area?.id}. {area?.name}
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

          {/* 6. New Record Checkbox */}
          <label className="flex items-center space-x-2 cursor-pointer text-sm text-gray-700">
            <input
              type="checkbox"
              checked={isNew}
              onChange={(e) => setIsNew(e.target.checked)}
              className="form-checkbox h-4 w-4 text-red-600 rounded"
            />
            <span>New Records</span>
          </label>

          {/* Status */}
          <div className="ml-auto text-sm font-medium text-gray-500">
            કુલ રેકોર્ડ્સ: {finalRecords.length} / {records.length}
          </div>
        </div>
      </div>

      <div
        ref={tableRef}
        className="table-container rounded-lg shadow-md border border-gray-200"
        onScroll={handleScroll}
        style={{ overflowX: "auto", position: "relative" }}
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg"
                style={{ padding: "5px 4px", textAlign: "center" }}
              >
                અનું કૂમાંક
              </th>

              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{
                  minWidth: "160px",
                  maxWidth: "160px",
                  padding: "5px 4px",
                  textAlign: "center",
                }}
              >
                માલિકનું નામ
              </th>

              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{
                  // minWidth: isMobile ? "80px" : "120px",
                  minWidth: "150px",
                  maxWidth: "150px",
                  padding: "5px 4px",
                  textAlign: "center",
                }}
              >
                વિસ્તારનું નામ
              </th>

              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ padding: "5px 4px", textAlign: "center" }}
              >
                મિલ્કત ક્રમાંક
              </th>

              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ padding: "5px 4px", textAlign: "center" }}
              >
                જુનો મિ.નં.
              </th>

              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{
                  minWidth: isMobile ? "150px" : "300px",
                  padding: "5px 4px",
                  textAlign: "center",
                }}
              >
                મિલકતનું વર્ણન
              </th>

              {isMobile ? (
                <th
                  className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ padding: "5px 4px", textAlign: "center" }}
                >
                  મોબાઈલ નંબર
                </th>
              ) : null}

              <th
                className="text-xs font-medium text-gray-500 lowercase tracking-wider"
                style={{ padding: "5px 4px", textAlign: "center" }}
              >
                મકાન category
              </th>

              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ padding: "5px 4px", textAlign: "center" }}
              >
                નળ
              </th>

              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ padding: "5px 4px", textAlign: "center" }}
              >
                શૌ.
              </th>

              {Number(imageAkarni || 0) !== 0 ? (
                <>
                  <th
                    className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ padding: "5px 4px", textAlign: "center" }}
                  >
                    ફોટો {Number(imageAkarni || 0) === 2 ? "1" : null}
                  </th>

                  {Number(imageAkarni || 0) === 2 ? (
                    <th
                      className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{ padding: "5px 4px", textAlign: "center" }}
                    >
                      ફોટો 2
                    </th>
                  ) : null}
                </>
              ) : null}

              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{
                  padding: "5px 4px",
                  textAlign: "center",
                  minWidth: isMobile ? "100px" : "140px",
                }}
              >
                નોંધ/રીમાર્કસ
              </th>

              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ padding: "5px 4px", textAlign: "center" }}
              >
                બિ.પ.
              </th>

              {/* Action Header - Made STICKY & Placed before 'Added By' */}
              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                style={{
                  // minWidth: "60px",
                  maxWidth: "fit-content",
                  padding: "5px 4px",
                  textAlign: "center",
                  position: "sticky",
                  right: "80px", // Because 'Added By' takes 80px space
                  zIndex: 20,
                  boxShadow: "-2px 0 5px rgba(0,0,0,0.02)",
                }}
              ></th>

              {/* Added By Header - Moved to Last and made STICKY */}
              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg bg-gray-50"
                style={{
                  minWidth: "80px",
                  padding: "5px 4px",
                  textAlign: "center",

                  boxShadow: "-2px 0 5px rgba(0,0,0,0.05)",
                }}
              >
                Added By
              </th>
            </tr>

            {/* Index Start */}
            <tr>
              {Array.from({
                length:
                  14 +
                  Number(isMobile === true ? 1 : 0) +
                  Number(imageAkarni !== 0 ? 1 : 0),
              }).map((_, index, arr) => {
                // Make the last TWO index cells sticky
                const isAction = index === arr.length - 2;
                const isAddedBy = index === arr.length - 1;
                const isSticky = isAction || isAddedBy;
                const rightPos = isAddedBy ? 0 : isAction ? "80px" : "auto";

                return (
                  <th
                    className="text-xs font-medium uppercase tracking-wider"
                    style={{
                      textAlign: "center",
                      color: "white",
                      background: background,
                      padding: "3px",
                      // position: isSticky ? "sticky" : "static",
                      // right: rightPos,
                      // zIndex: isSticky ? 20 : 1,
                    }}
                    key={index}
                  >
                    {index + 1}
                  </th>
                );
              })}
            </tr>
            {/* Index End */}
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {finalRecords.map((record, index) => {
              let survayorData = record[17];
              const isNewValueColor =
                record[24] === true ||
                record[24] === "true" ||
                record[24] === "TRUE";

              const rowBgColor = isNewValueColor ? "#fef3c7" : "#ffffff";

              if (typeof survayorData === "string") {
                try {
                  survayorData = JSON.parse(survayorData);
                } catch (error) {
                  console.error("Error parsing survayor data:", error);
                  survayorData = null;
                }
              }

              return (
                <tr
                  key={index}
                  style={{
                    background: isNewValueColor ? "#fef3c7" : "transparent",
                  }}
                >
                  <td
                    className="whitespace-nowrap text-sm font-medium text-gray-900"
                    style={{ padding: "2px 3px" }}
                  >
                    {record[0]}
                  </td>

                  <td
                    className="text-sm text-gray-500"
                    style={{ padding: "2px 3px", wordBreak: "break-word" }}
                  >
                    {record[3]}
                  </td>

                  <td
                    className="text-sm text-gray-500"
                    style={{ padding: "2px 3px", wordBreak: "break-word" }}
                  >
                    {record[1]}
                  </td>

                  <td
                    className="whitespace-normal text-sm text-gray-500"
                    style={{ padding: "2px 3px" }}
                  >
                    {record[2]}
                  </td>

                  <td
                    className="whitespace-normal text-sm text-gray-500"
                    style={{ padding: "2px 3px" }}
                  >
                    {record[5]}
                  </td>

                  <td
                    className="whitespace-normal text-sm text-gray-500"
                    style={{ padding: "2px 3px" }}
                  >
                    {record[8]?.includes("પ્લોટ") ? record[8] : ""} {record[16]}{" "}
                    {record[7] ? `, ${record[7]}` : ""}
                  </td>

                  {isMobile ? (
                    <td
                      className="whitespace-normal text-sm text-gray-500"
                      style={{ padding: "2px 3px" }}
                    >
                      {record[6]}
                    </td>
                  ) : null}

                  <td
                    className="whitespace-nowrap text-sm text-gray-500"
                    style={{ padding: "2px 3px" }}
                  >
                    {record[8]}
                  </td>

                  <td
                    className="whitespace-nowrap text-sm text-gray-500"
                    style={{ padding: "2px 3px" }}
                  >
                    {record[12]}
                  </td>

                  <td
                    className="whitespace-nowrap text-sm text-gray-500"
                    style={{ padding: "2px 3px" }}
                  >
                    {record[13]}
                  </td>

                  {Number(imageAkarni || 0) !== 0 ? (
                    <td
                      className="whitespace-normal text-sm text-gray-500"
                      style={{ padding: "2px 3px" }}
                    >
                      <DelayedImage
                        fileId={JSON.parse(record[26] || "[]")[0] || ""}
                        delayIndex={0}
                      />
                    </td>
                  ) : null}

                  <td
                    className="whitespace-normal text-sm text-gray-500"
                    style={{ padding: "2px 3px" }}
                  >
                    {record[14]}
                  </td>

                  <td
                    className="whitespace-normal text-sm text-gray-500"
                    style={{ padding: "2px 3px" }}
                  >
                    {record[14]?.includes("બિ.પ.") ? "બિ.પ." : ""}
                  </td>

                  {/* Action Column - Icons Only & STICKY */}
                  <td
                    className="text-sm text-gray-500"
                    style={{
                      display: "flex",
                      flexDirection: "row", // Side-by-side as icons are small
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                      padding: "4px",
                      position: "sticky",
                      right: "10px", // Fixed 80px away from right to make room for Added By
                      zIndex: 10,
                      background: rowBgColor,
                      boxShadow: "-2px 0 5px rgba(0,0,0,0.02)",
                    }}
                  >
                    <button
                      onClick={() => navigate(`/form/${record[0]}`)}
                      className="bg-blue-500 hover:bg-blue-700 text-white p-1.5 rounded"
                      title="Edit"
                    >
                      {/* Edit (Pencil) Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    {user.id === survayorData?.id ? (
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
                        className="bg-red-500 hover:bg-red-700 text-white p-1.5 rounded"
                        title="Delete"
                      >
                        {/* Delete (Trash) Icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    ) : null}
                  </td>

                  {/* Added By - Last Column & STICKY */}
                  <td
                    className="whitespace-normal text-sm text-gray-500 text-center"
                    style={{
                      padding: "2px 3px",
                      minWidth: "80px",
                      // position: "sticky",
                      // right: 0,
                      // zIndex: 10,
                      background: rowBgColor,
                      boxShadow: "-2px 0 5px rgba(0,0,0,0.05)",
                    }}
                  >
                    <span style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                      {survayorData?.name || "Unknown"}
                    </span>
                  </td>
                </tr>
              );
            })}

            {records.length === 0 && !loading && !error && (
              <tr>
                <td
                  colSpan="15"
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
