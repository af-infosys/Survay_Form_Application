import React, { useEffect, useState } from "react";
import apiPath from "../isProduction";

// The main component for the analytics report
const AnalyticsReport = () => {
  // Use state to manage all the report data
  const [reportData, setReportData] = useState({
    village: "મેઘરજ",
    taluka: "મેઘરજ",
    district: "અરવલ્લી",
    year: "૨૦૨૫/૨૬",
    metrics: [
      {
        id: 1,
        description: "ગામની કુલ ટોટલ મિલ્કતોની સંખ્યા",
        count: 0,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2m0 0V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v2M7 7a2 2 0 00-2 2v6a2 2 0 002 2h2m2-4h2m-4-2h4m-2 2v4m2-4v4m-2-4h2v4h-2V7z"
            />
          </svg>
        ),
      },
      {
        id: 2,
        description: "કુલ રહેણાંક વાળા મકાનો",
        count: 0,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6-4h4"
            />
          </svg>
        ),
      },
      {
        id: 3,
        description: "કુલ રહેણાંક વાળા પાકા મકાનો",
        count: 0,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6-4h4"
            />
          </svg>
        ),
      },
      {
        id: 4,
        description: "ગામના કુલ રહેણાંક વાળા કાચા મકાનો",
        count: 0,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6-4h4"
            />
          </svg>
        ),
      },
      {
        id: 5,
        description: "ગામની કુલ દુકાનો",
        count: 0,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-purple-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14v12H5V9z"
            />
          </svg>
        ),
      },
      {
        id: 6,
        description: "કારખાનાઓ / ફેક્ટરી પ્રાઈવેટ-ખાનગી કુલ",
        count: 0,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z"
            />
          </svg>
        ),
      },
      {
        id: 7,
        description: "પ્લોટ/ખુલ્લી જગ્યા પ્રાઈવેટ કુલ",
        count: 0,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-yellow-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2m0 0V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v2M7 7a2 2 0 00-2 2v6a2 2 0 002 2h2m2-4h2m-4-2h4m-2 2v4m2-4v4m-2-4h2v4h-2V7z"
            />
          </svg>
        ),
      },
      {
        id: 8,
        description: "સરકારી મિલ્કતો કુલ",
        count: 0,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-red-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2m0 0V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v2M7 7a2 2 0 00-2 2v6a2 2 0 002 2h2m2-4h2m-4-2h4m-2 2v4m2-4v4m-2-4h2v4h-2V7z"
            />
          </svg>
        ),
      },
      {
        id: 9,
        description: "ધાર્મિક સ્થળો કુલ",
        count: 0,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-purple-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a48.555 48.555 0 01.127 1.391l-.621 1.954c-.237.747-.942 1.251-1.748 1.251H5.77a2 2 0 01-1.748-1.251l-.621-1.954a48.56 48.56 0 01.127-1.391L12 14z" />
          </svg>
        ),
      },
      {
        id: 10,
        description: "પ્લોટ/ખુલ્લી જગ્યા સરકારી કુલ",
        count: 0,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-yellow-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2m0 0V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v2M7 7a2 2 0 00-2 2v6a2 2 0 002 2h2m2-4h2m-4-2h4m-2 2v4m2-4v4m-2-4h2v4h-2V7z"
            />
          </svg>
        ),
      },
      {
        id: 11,
        description: "નળની કુલ સંખ્યા",
        count: 0,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M10 14a2 2 0 100 4 2 2 0 000-4zM21 21v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2z" />
          </svg>
        ),
      },
      {
        id: 12,
        description: "શૌચાલયની કુલ સંખ્યા",
        count: 0,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 21a9 9 0 009-9H3a9 9 0 009 9z"
            />
          </svg>
        ),
      },
      {
        id: 13,
        description: "મોબાઈલ ટાવરની કુલ સંખ્યા",
        count: 0,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-indigo-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 12h.01M16 12h.01M13 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      },
      {
        id: 14,
        description: "વાહનોની કુલ સંખ્યા",
        count: 0,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14a2 2 0 100 4 2 2 0 000-4zM21 21v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2z"
            />
          </svg>
        ),
      },
      {
        id: 15,
        description: "વિસ્તાર ગામના કુલ એરીયાની સંખ્યા",
        count: 0,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M10 14a2 2 0 100 4 2 2 0 000-4zM21 21v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2z" />
          </svg>
        ),
      },
      {
        id: 16,
        description: "એરીયા વિસ્તાર વાઇઝ મિલ્કત માલીકની સંખ્યા",
        count: 0,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M10 14a2 2 0 100 4 2 2 0 000-4zM21 21v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2z" />
          </svg>
        ),
      },
      {
        id: 17,
        description: "૧-મિલ્કતથી વધારે મિલ્કતો ધરાવતા હોય તેવા માલીકની સંખ્યા",
        count: 0,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.3-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.3.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        ),
      },
      {
        id: 18,
        description: "ફક્ત ૧ જ મિલ્કત હોય તેવા મિલ્કત માલીકની સંખ્યા",
        count: 0,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        ),
      },
      {
        id: 19,
        description: "મોબાઇલ ફોન ઉપયોગ કરતા વ્યકિતઓની નંબરની કુલ સંખ્યા",
        count: 0,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        ),
      },
    ],
  });

  const [records, setRecords] = useState([]);

  const fetchRecords = async () => {
    try {
      const response = await fetch(`${await apiPath()}/api/sheet`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setRecords(result.data);
    } catch (err) {
      console.error("Error fetching records:", err);
      alert("ડેટા લાવવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.");
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    calculateMetrics();
  }, [records]);

  function calculateMetrics() {
    const TotalCount = records.length;

    const RahenankCount = records.filter(
      (record) => record[7]?.trim() === "રહેણાંક"
    ).length;

    const RahenankPakaCount = records.filter(
      (record) =>
        record[7]?.trim() === "રહેણાંક" && record[15]?.includes("પાકા")
    ).length;

    const RahenankKachaCount = RahenankCount - RahenankPakaCount;

    const DukanCount = records.filter(
      (record) => record[7]?.trim() === "દુકાન" || record[15]?.includes("દુકાન")
    ).length;

    const FactoryCount = records.filter(
      (record) => record[7]?.trim() === "કારખાના - ઇન્ડસ્ટ્રીજ઼"
    ).length;

    const PlotCount = records.filter(
      (record) => record[7]?.trim() === "પ્લોટ - ખુલ્લી જગ્યા ખાનગી"
    ).length;

    const GovnOwnedCount = records.filter((record) =>
      record[7]?.includes("સરકારી")
    ).length;

    const DharmikCount = records.filter(
      (record) => record[7]?.trim() === "ધાર્મિક સ્થળ"
    ).length;

    const GovnPlotCount = records.filter(
      (record) => record[7]?.trim() === "પ્લોટ - ખુલ્લી જગ્યા ખાનગી"
    ).length; // Edit

    let TapCount = 0;
    records.forEach((record) => {
      TapCount += Number(record[11]);
    });

    let ToiletCount = 0;
    records.forEach((record) => {
      ToiletCount += Number(record[12]) || 0;
    });

    const DuplicateCount = records.reduce((count, record) => {
      const value = record[3];
      return count + (records.filter((r) => r[3] === value).length > 1 ? 1 : 0);
    }, 0); // Fix

    // count not null on 5th index
    const usePhoneCount = records.filter((record) => record[5] !== "").length;

    const Count = -1;

    setReportData((prev) => {
      return {
        ...prev,
        metrics: [
          { ...prev.metrics[0], count: TotalCount },
          { ...prev.metrics[1], count: RahenankCount },
          { ...prev.metrics[2], count: RahenankPakaCount },
          { ...prev.metrics[3], count: RahenankKachaCount },
          { ...prev.metrics[4], count: DukanCount },
          { ...prev.metrics[5], count: FactoryCount },
          { ...prev.metrics[6], count: PlotCount },
          { ...prev.metrics[7], count: GovnOwnedCount },
          { ...prev.metrics[8], count: DharmikCount },
          { ...prev.metrics[9], count: GovnPlotCount },
          { ...prev.metrics[10], count: TapCount },
          { ...prev.metrics[11], count: ToiletCount },
          { ...prev.metrics[12], count: Count },
          { ...prev.metrics[13], count: Count },
          { ...prev.metrics[14], count: Count },
          { ...prev.metrics[15], count: Count },
          { ...prev.metrics[16], count: DuplicateCount },
          { ...prev.metrics[17], count: Count },
          { ...prev.metrics[18], count: usePhoneCount },
        ],
      };
    });
  }

  // Function to generate and download the PDF
  const generatePDF = () => {
    const input = document.getElementById("report-content");
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, "0")}-${(
      today.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${today.getFullYear()}`;
    const filename = `Aakarni_Report_${reportData.village}_${formattedDate}.pdf`;

    if (input) {
      // Use html2canvas to render the HTML as a canvas image
      window
        .html2canvas(input, {
          scale: 2, // Higher scale for better quality
          logging: true,
          useCORS: true,
        })
        .then((canvas) => {
          // Create a new jsPDF document
          // Legal size: 8.5 x 14 inches
          // Landscape orientation: 'l'
          const pdf = new window.jsPDF("l", "pt", "legal");
          const imgData = canvas.toDataURL("image/jpeg", 1.0);
          const imgWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;
          let position = 0;

          // Add the image to the PDF
          pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          // Handle multi-page reports if needed
          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }

          // Save the PDF
          pdf.save(filename);
        });
    }
  };

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 bg-gray-100 min-h-screen font-sans">
      {/* Load html2canvas and jspdf from CDN for PDF generation */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

      {/* Report container for PDF generation */}
      <div
        id="report-content"
        className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-6 sm:p-10 mb-8"
      >
        <header className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 leading-tight">
            Aakarni Analysis Report - વિશ્લેષણ ગામનો સર્વે અહેવાલ
          </h1>
          <h2 className="text-lg sm:text-xl text-gray-600 mb-4">
            સને {reportData.year}
          </h2>
          <hr className="border-t-2 border-dashed border-gray-300 w-24 mx-auto" />
        </header>

        {/* Village details section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-gray-700 mb-8">
          <span className="p-3 bg-blue-50 rounded-lg shadow-sm">
            ગામ :{" "}
            <b className="font-semibold text-blue-800">{reportData.village}</b>
          </span>
          <span className="p-3 bg-blue-50 rounded-lg shadow-sm">
            તાલુકો :{" "}
            <b className="font-semibold text-blue-800">{reportData.taluka}</b>
          </span>
          <span className="p-3 bg-blue-50 rounded-lg shadow-sm">
            જીલ્લો :{" "}
            <b className="font-semibold text-blue-800">{reportData.district}</b>
          </span>
        </div>

        {/* Main analytics grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportData.metrics.map((metric) => (
            <div
              key={metric.id}
              className="flex flex-col items-start p-6 bg-white border border-gray-200 rounded-xl shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="flex items-center space-x-3 mb-2">
                <span className="p-2 bg-gray-100 rounded-full">
                  {metric.icon}
                </span>
                <span className="text-sm font-semibold text-gray-500">
                  ક્રમ: {metric.id}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1">
                વર્ણન: {metric.description}
              </h3>
              <p className="text-lg sm:text-xl font-bold text-blue-600">
                સંખ્યા: {metric.count}
              </p>
            </div>
          ))}
        </section>
      </div>

      {/* PDF Download Button */}
      <div className="mt-4">
        <button
          onClick={generatePDF}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors duration-300 flex items-center space-x-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span>અહેવાલ PDF ડાઉનલોડ કરો</span>
        </button>
      </div>
    </div>
  );
};

export default AnalyticsReport;
