import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../config/AuthContext";

const MenuBar = () => {
  const { user } = useAuth();

  return (
    <>
      {/* Desktop Sidebar Menu (hidden on small screens) */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-blue-700 text-white p-4 shadow-lg rounded-r-xl">
        <div className="flex flex-col items-start w-full">
          <div className="text-3xl font-bold rounded-md p-2 mb-6 cursor-pointer">
            Dashboard
          </div>
          <div className="flex flex-col space-y-4 w-full">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `p-3 rounded-md transition-colors font-medium text-lg flex items-center gap-3 ${
                  isActive ? "bg-blue-800 shadow-md" : "hover:bg-blue-600"
                }`
              }
            >
              {/* Form Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-form-input"
              >
                <path d="M2 12h10" />
                <path d="M12 2v20" />
                <path d="M18 5v14" />
                <path d="M4.93 4.93l1.41 1.41" />
                <path d="M17.66 17.66l1.41 1.41" />
                <path d="M17.66 6.34l1.41-1.41" />
                <path d="M4.93 19.07l1.41-1.41" />
              </svg>
              ફોર્મ
            </NavLink>
            <NavLink
              to="/report"
              className={({ isActive }) =>
                `p-3 rounded-md transition-colors font-medium text-lg flex items-center gap-3 ${
                  isActive ? "bg-blue-800 shadow-md" : "hover:bg-blue-600"
                }`
              }
            >
              {/* Report Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-file-text"
              >
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                <path d="M10 9H8" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
              </svg>
              રિપોર્ટ
            </NavLink>
            <NavLink
              to="/society"
              className={({ isActive }) =>
                `p-3 rounded-md transition-colors font-medium text-lg flex items-center gap-3 ${
                  isActive ? "bg-blue-800 shadow-md" : "hover:bg-blue-600"
                }`
              }
            >
              {/* Society Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-building"
              >
                <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
                <path d="M9 22v-4h6v4" />
                <path d="M8 6h.01" />
                <path d="M16 6h.01" />
                <path d="M12 6h.01" />
                <path d="M12 10h.01" />
                <path d="M12 14h.01" />
                <path d="M16 10h.01" />
                <path d="M16 14h.01" />
                <path d="M8 10h.01" />
                <path d="M8 14h.01" />
              </svg>
              સોસાયટી
            </NavLink>

            {user?.role === "owner" && (
              <>
                <NavLink
                  to="/analytics"
                  className={({ isActive }) =>
                    `p-3 rounded-md transition-colors font-medium text-lg flex items-center gap-3 ${
                      isActive ? "bg-blue-800 shadow-md" : "hover:bg-blue-600"
                    }`
                  }
                >
                  {/* Analytics Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-bar-chart"
                  >
                    <line x1="12" x2="12" y1="20" y2="10" />
                    <line x1="18" x2="18" y1="20" y2="4" />
                    <line x1="6" x2="6" y1="20" y2="16" />
                  </svg>
                  એનાલિટિક્સ
                </NavLink>

                <NavLink
                  to="/index"
                  className={({ isActive }) =>
                    `p-3 rounded-md transition-colors font-medium text-lg flex items-center gap-3 ${
                      isActive ? "bg-blue-800 shadow-md" : "hover:bg-blue-600"
                    }`
                  }
                >
                  {/* Analytics Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-bar-chart"
                  >
                    <line x1="12" x2="12" y1="20" y2="10" />
                    <line x1="18" x2="18" y1="20" y2="4" />
                    <line x1="6" x2="6" y1="20" y2="16" />
                  </svg>
                  Index
                </NavLink>
              </>
            )}

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `p-3 rounded-md transition-colors font-medium text-lg flex items-center gap-3 ${
                  isActive ? "bg-blue-800 shadow-md" : "hover:bg-blue-600"
                }`
              }
            >
              {/* Profile Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-user"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              પ્રોફાઇલ
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Menu (hidden on large screens) */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-blue-700 text-white p-2 shadow-lg z-50 rounded-t-xl">
        <div className="flex justify-around items-center h-full">
          {/* Each link is a flex item for vertical alignment of icon and text */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-md transition-colors text-xs font-medium ${
                isActive ? "bg-blue-800 shadow-md" : "hover:bg-blue-600"
              }`
            }
          >
            {/* Using Lucide React icons for demonstration, assuming it's available.
                If not, you can replace with Font Awesome or inline SVGs. */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-form-input"
            >
              <path d="M2 12h10" />
              <path d="M12 2v20" />
              <path d="M18 5v14" />
              <path d="M4.93 4.93l1.41 1.41" />
              <path d="M17.66 17.66l1.41 1.41" />
              <path d="M17.66 6.34l1.41-1.41" />
              <path d="M4.93 19.07l1.41-1.41" />
            </svg>
            <span className="mt-1">ફોર્મ</span>
          </NavLink>
          <NavLink
            to="/report"
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-md transition-colors text-xs font-medium ${
                isActive ? "bg-blue-800 shadow-md" : "hover:bg-blue-600"
              }`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-file-text"
            >
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" />
              <path d="M10 9H8" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
            </svg>
            <span className="mt-1">રિપોર્ટ</span>
          </NavLink>
          <NavLink
            to="/society"
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-md transition-colors text-xs font-medium ${
                isActive ? "bg-blue-800 shadow-md" : "hover:bg-blue-600"
              }`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-building"
            >
              <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
              <path d="M9 22v-4h6v4" />
              <path d="M8 6h.01" />
              <path d="M16 6h.01" />
              <path d="M12 6h.01" />
              <path d="M12 10h.01" />
              <path d="M12 14h.01" />
              <path d="M16 10h.01" />
              <path d="M16 14h.01" />
              <path d="M8 10h.01" />
              <path d="M8 14h.01" />
            </svg>
            <span className="mt-1">સોસાયટી</span>
          </NavLink>

          {user?.role === "owner" && (
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                `flex flex-col items-center p-2 rounded-md transition-colors text-xs font-medium ${
                  isActive ? "bg-blue-800 shadow-md" : "hover:bg-blue-600"
                }`
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-bar-chart"
              >
                <line x1="12" x2="12" y1="20" y2="10" />
                <line x1="18" x2="18" y1="20" y2="4" />
                <line x1="6" x2="6" y1="20" y2="16" />
              </svg>
              <span className="mt-1">એનાલિટિક્સ</span>
            </NavLink>
          )}

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-md transition-colors text-xs font-medium ${
                isActive ? "bg-blue-800 shadow-md" : "hover:bg-blue-600"
              }`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-user"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="mt-1">પ્રોફાઇલ</span>
          </NavLink>
        </div>
      </nav>
    </>
  );
};

export default MenuBar;
