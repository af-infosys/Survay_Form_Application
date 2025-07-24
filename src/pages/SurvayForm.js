import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../config/AuthContext";
import apiPath from "../isProduction";

import "./SurvayForm.scss";
import WorkSpot from "../components/WorkSpot";

const SurvayForm = () => {
  const { user } = useAuth();

  const { id } = useParams();
  const isEditMode = !!id;

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    serialNumber: "",
    areaName: "",
    propertyNumber: "",
    ownerName: "",
    oldPropertyNumber: "",
    mobileNumber: "",
    propertyNameOnRecord: "",
    houseCategory: "",
    kitchenCount: 0,
    bathroomCount: 0,
    verandaCount: 0,
    tapCount: 0,
    toiletCount: 0,
    remarks: "",
    survayor: user?.id,
  });

  const [floors, setFloors] = useState([
    {
      type: "",
      slabRooms: 0,
      tinRooms: 0,
      woodenRooms: 0,
      tileRooms: 0,
      roomHallShopGodown: "",
    },
  ]);

  const [areas, setAreas] = useState([]);
  const [areasLoading, setAreasLoading] = useState(true);
  const [areasError, setAreasError] = useState(null);
  const [formLoading, setFormLoading] = useState(false); // For form submission/load
  const [formError, setFormError] = useState(null); // For form submission/load errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFloorChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFloors = floors.map((floor, i) =>
      i === index ? { ...floor, [name]: value } : floor
    );
    setFloors(updatedFloors);
  };

  const addFloor = () => {
    setFloors((prevFloors) => [
      ...prevFloors,
      {
        type: "",
        slabRooms: 0,
        tinRooms: 0,
        woodenRooms: 0,
        tileRooms: 0,
        roomHallShopGodown: "",
      },
    ]);
  };

  const getFloorName = (index) => {
    if (index === 0) return "ગ્રાઉન્ડ ફ્લોર";
    if (index === 1) return "પ્રથમ માળ";
    if (index === 2) return "બીજો માળ";
    if (index === 3) return "ત્રીજો માળ";
    return `${index + 1}મો માળ`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    const fullFormData = {
      ...formData,
      floors: floors,
    };

    try {
      const method = isEditMode ? "PUT" : "POST";
      const endpoint = isEditMode
        ? `${await apiPath()}/api/sheet/${id}`
        : `${await apiPath()}/api/sheet/add`;

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fullFormData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Success:", result.message);
        alert(`ફોર્મ સફળતાપૂર્વક ${isEditMode ? "અપડેટ" : "સબમિટ"} થયું!`);
        navigate("/report");

        // Reset form only if it's a new submission
        if (!isEditMode) {
          setFormData({
            serialNumber: "",
            areaName: "",
            propertyNumber: "",
            ownerName: "",
            oldPropertyNumber: "",
            mobileNumber: "",
            propertyNameOnRecord: "",
            houseCategory: "",
            kitchenCount: 0,
            bathroomCount: 0,
            verandaCount: 0,
            tapCount: 0,
            toiletCount: 0,
            remarks: "",
            survayor: user?.id,
          });
          setFloors([
            {
              type: "",
              slabRooms: 0,
              tinRooms: 0,
              woodenRooms: 0,
              tileRooms: 0,
              roomHallShopGodown: "",
            },
          ]);
        }
      } else {
        console.error("Error submitting form:", result.message);
        setFormError(
          `ફોર્મ ${isEditMode ? "અપડેટ" : "સબમિટ"} કરવામાં ભૂલ: ${
            result.message
          }`
        );
      }
    } catch (error) {
      console.error("Network error or unexpected issue:", error);
      setFormError("નેટવર્ક ભૂલ અથવા અણધારી સમસ્યા આવી.");
    } finally {
      setFormLoading(false);
    }
  };

  // Effect to load existing data if in edit mode
  useEffect(() => {
    const fetchRecordForEdit = async () => {
      if (!isEditMode || !id) return;

      setFormLoading(true);
      setFormError(null);
      try {
        const response = await fetch(`${await apiPath()}/api/sheet/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        const record = result.data;

        if (record) {
          // Populate formData
          setFormData({
            serialNumber: record[0] || "",
            areaName: record[1] || "",
            propertyNumber: record[2] || "",
            ownerName: record[3] || "",
            oldPropertyNumber: record[4] || "",
            mobileNumber: record[5] | "",
            propertyNameOnRecord: record[6] || "",
            houseCategory: record[7] || "",
            kitchenCount: Number(record[8]) || 0,
            bathroomCount: Number(record[9]) || 0,
            verandaCount: Number(record[10]) || 0,
            tapCount: Number(record[11]) || 0,
            toiletCount: Number(record[12]) || 0,
            remarks: record[13] || "",
          });

          // Populate floors, parsing JSON if necessary
          if (record[14]) {
            try {
              const parsedFloors = JSON.parse(record[14]);
              setFloors(parsedFloors);
            } catch (jsonError) {
              console.error("Error parsing floors JSON:", jsonError);
              setFloors([
                {
                  type: "",
                  slabRooms: 0,
                  tinRooms: 0,
                  woodenRooms: 0,
                  tileRooms: 0,
                  roomHallShopGodown: "",
                },
              ]);
            }
          } else {
            setFloors([
              {
                type: "",
                slabRooms: 0,
                tinRooms: 0,
                woodenRooms: 0,
                tileRooms: 0,
                roomHallShopGodown: "",
              },
            ]);
          }
        } else {
          setFormError("રેકોર્ડ મળ્યો નથી.");
        }
      } catch (err) {
        console.error("Error fetching record for edit:", err);
        setFormError("રેકોર્ડ લાવવામાં નિષ્ફળ.");
      } finally {
        setFormLoading(false);
      }
    };

    fetchRecordForEdit();
  }, [id, isEditMode, user?.id]);

  // Effect for loading external CSS and JS (Tailwind)
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const tailwindScript = document.createElement("script");
    tailwindScript.src = "https://cdn.tailwindcss.com";
    document.head.appendChild(tailwindScript);

    // Fetch areas for the dropdown
    const fetchAreas = async () => {
      setAreasLoading(true);
      setAreasError(null);
      try {
        const response = await fetch(`${await apiPath()}/api/sheet/areas`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setAreas(result.data);
      } catch (err) {
        console.error("Error fetching areas:", err);
        setAreasError("વિસ્તારો લાવવામાં નિષ્ફળ.");
      } finally {
        setAreasLoading(false);
      }
    };

    fetchAreas();

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(tailwindScript);
    };
  }, []);

  return (
    <div className="form-container p-8">
      {/* Added margin for sidebar */}

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        સર્વે ફોર્મ {isEditMode ? "(સંપાદિત કરો)" : ""}
      </h1>

      <WorkSpot />

      {formLoading && (
        <div className="text-center text-blue-600 text-lg mb-4">
          {isEditMode
            ? "રેકોર્ડ લોડ થઈ રહ્યો છે..."
            : "ફોર્મ સબમિટ થઈ રહ્યું છે..."}
        </div>
      )}
      {formError && (
        <div className="text-center text-red-600 text-lg mb-4">{formError}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Field 1: અનું ક્રમાંક */}
          <div className="form-field">
            <label htmlFor="serialNumber" className="form-label">
              1. અનું ક્રમાંક
            </label>
            <input
              type="text"
              id="serialNumber"
              name="serialNumber"
              className="form-input"
              placeholder="દા.ત. 001"
              value={formData.serialNumber}
              onChange={handleChange}
              required
              disabled={isEditMode}
            />
          </div>

          {/* Field 2: વિસ્તારનું નામ (હવે select dropdown) */}
          <div className="form-field">
            <label htmlFor="areaName" className="form-label">
              2. વિસ્તારનું નામ
            </label>
            {areasLoading ? (
              <select className="form-select" disabled>
                <option>વિસ્તારો લોડ થઈ રહ્યા છે...</option>
              </select>
            ) : areasError ? (
              <select className="form-select" disabled>
                <option>વિસ્તારો લોડ કરવામાં ભૂલ</option>
              </select>
            ) : (
              <select
                id="areaName"
                name="areaName"
                className="form-select"
                value={formData.areaName}
                onChange={handleChange}
                required
              >
                <option value="">વિસ્તાર પસંદ કરો</option>
                {areas?.map((area) => (
                  <option key={area?.id} value={area?.name}>
                    {area?.id}. {area?.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Field 3: મિલ્કત ક્રમાંક */}
          <div className="form-field">
            <label htmlFor="propertyNumber" className="form-label">
              3. મિલ્કત ક્રમાંક
            </label>
            <input
              type="text"
              id="propertyNumber"
              name="propertyNumber"
              className="form-input"
              placeholder="દા.ત. P12345"
              value={formData.propertyNumber}
              onChange={handleChange}
              required
            />
          </div>

          {/* Field 4: માલિકનું નામ */}
          <div className="form-field">
            <label htmlFor="ownerName" className="form-label">
              4. માલિકનું નામ
            </label>
            <input
              type="text"
              id="ownerName"
              name="ownerName"
              className="form-input"
              placeholder="દા.ત. સુરેશભાઈ પટેલ"
              value={formData.ownerName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Field 5: જુનો મિલકત નંબર */}
          <div className="form-field">
            <label htmlFor="oldPropertyNumber" className="form-label">
              5. જુનો મિલકત નંબર
            </label>
            <input
              type="text"
              id="oldPropertyNumber"
              name="oldPropertyNumber"
              className="form-input"
              placeholder="જો હોય તો દાખલ કરો"
              value={formData.oldPropertyNumber}
              onChange={handleChange}
            />
          </div>

          {/* Field 6: મોબાઈલ નંબર */}
          <div className="form-field">
            <label htmlFor="mobileNumber" className="form-label">
              6. મોબાઈલ નંબર
            </label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              className="form-input"
              placeholder="દા.ત. 9876543210"
              pattern="[0-9]{10}"
              title="કૃપા કરીને 10 અંકનો મોબાઇલ નંબર દાખલ કરો"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
            />
          </div>

          {/* Field 7: મિલ્ક્ત પર લખેલ નામ મકાન/દુકાન/ કારખાના/ કંપનીનું નામ */}
          <div className="form-field md:col-span-2">
            <label htmlFor="propertyNameOnRecord" className="form-label">
              7. મિલ્ક્ત પર લખેલ નામ મકાન/દુકાન/ કારખાના/ કંપનીનું નામ
            </label>
            <input
              type="text"
              id="propertyNameOnRecord"
              name="propertyNameOnRecord"
              className="form-input"
              placeholder="દા.ત. શ્રી ગણેશ નિવાસ"
              value={formData.propertyNameOnRecord}
              onChange={handleChange}
              required
            />
          </div>

          {/* Field 9: મકાન category */}
          <div className="form-field">
            <label htmlFor="houseCategory" className="form-label">
              8. મકાન category
            </label>
            <select
              id="houseCategory"
              name="houseCategory"
              className="form-select"
              value={formData.houseCategory}
              onChange={handleChange}
              required
            >
              <option value="">કેટેગરી પસંદ કરો</option>
              <option value="રહેણાંક">1. રહેણાંક - મકાન</option>
              <option value="દુકાન">2. દુકાન</option>
              <option value="ધાર્મિક સ્થળ">3. ધાર્મિક સ્થળ</option>
              <option value="સરકારી મિલ્ક્ત">4. સરકારી મિલ્ક્ત</option>
              <option value="પ્રાઈવેટ - સંસ્થાઓ">5. પ્રાઈવેટ - સંસ્થાઓ</option>
              <option value="પ્લોટ - ખુલ્લી જગ્યા ખાનગી">
                6. પ્લોટ - ખુલ્લી જગ્યા ખાનગી
              </option>
              <option value="કોમનપ્લોટ - સરકારી પ્લોટ">
                7. કોમનપ્લોટ - સરકારી પ્લોટ
              </option>
              <option value="કારખાના - ઇન્ડસ્ટ્રીજ઼">
                8. કારખાના - ઇન્ડસ્ટ્રીજ઼
              </option>
              <option value="ટ્રસ્ટ મિલ્કત / NGO">
                9. ટ્રસ્ટ મિલ્કત / NGO
              </option>
              <option value="મંડળી - સેવા સહકારી મંડળી">
                10. મંડળી - સેવા સહકારી મંડળી
              </option>
              <option value="બેંક - સરકારી">11. બેંક - સરકારી</option>
              <option value="બેંક - અર્ધ સરકારી બેંક">
                12. બેંક - અર્ધ સરકારી બેંક
              </option>
              <option value="બેંક - પ્રાઇટ બેંક">13. બેંક - પ્રાઇટ બેંક</option>
              <option value="સરકારી સહાય આવાસ">14. સરકારી સહાય આવાસ</option>
              <option value="કોમ્પપ્લેક્ષ">15. કોમ્પપ્લેક્ષ</option>
            </select>
          </div>
        </div>

        <h2 className="section-title mt-8">9. માળની વિગતો</h2>

        <div id="floorsContainer">
          {floors.map((floor, index) => (
            <div key={index} className="floor-section">
              <h3 className="floor-section-title">
                માળ <span className="floor-index">{index + 1}</span>:{" "}
                {getFloorName(index)}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* Field 10: type */}
                <div className="form-field">
                  <label htmlFor={`floorType-${index}`} className="form-label">
                    પ્રકાર
                  </label>
                  <select
                    id={`floorType-${index}`}
                    name="type"
                    className="form-select"
                    value={floor.type}
                    onChange={(e) => handleFloorChange(index, e)}
                    required
                  >
                    <option value="">પ્રકાર પસંદ કરો</option>
                    <option value="પાકા">પાકા</option>
                    <option value="કાચા">કાચા</option>
                  </select>
                </div>

                {/* Field 11: સ્લેબ */}
                <div className="form-field">
                  <label htmlFor={`slabRooms-${index}`} className="form-label">
                    સ્લેબ
                  </label>
                  <input
                    type="number"
                    id={`slabRooms-${index}`}
                    name="slabRooms"
                    className="form-input"
                    min="0"
                    value={floor.slabRooms}
                    onChange={(e) => handleFloorChange(index, e)}
                    required
                  />
                </div>

                {/* Field 12: પતરા */}
                <div className="form-field">
                  <label htmlFor={`tinRooms-${index}`} className="form-label">
                    પતરા
                  </label>
                  <input
                    type="number"
                    id={`tinRooms-${index}`}
                    name="tinRooms"
                    className="form-input"
                    min="0"
                    value={floor.tinRooms}
                    onChange={(e) => handleFloorChange(index, e)}
                    required
                  />
                </div>

                {/* Field 13: પીઢીયા */}
                <div className="form-field">
                  <label
                    htmlFor={`woodenRooms-${index}`}
                    className="form-label"
                  >
                    પીઢીયા
                  </label>
                  <input
                    type="number"
                    id={`woodenRooms-${index}`}
                    name="woodenRooms"
                    className="form-input"
                    min="0"
                    value={floor.woodenRooms}
                    onChange={(e) => handleFloorChange(index, e)}
                    required
                  />
                </div>

                {/* Field 14: નળીયા */}
                <div className="form-field">
                  <label htmlFor={`tileRooms-${index}`} className="form-label">
                    નળીયા
                  </label>
                  <input
                    type="number"
                    id={`tileRooms-${index}`}
                    name="tileRooms"
                    className="form-input"
                    min="0"
                    value={floor.tileRooms}
                    onChange={(e) => handleFloorChange(index, e)}
                    required
                  />
                </div>

                {/* Field 15: રૂમ હોલ દુકાન ગોડાઉન */}
                <div className="form-field">
                  <label
                    htmlFor={`roomHallShopGodown-${index}`}
                    className="form-label"
                  >
                    રૂમ હોલ દુકાન ગોડાઉન
                  </label>
                  <select
                    id={`roomHallShopGodown-${index}`}
                    name="roomHallShopGodown"
                    className="form-select"
                    value={floor.roomHallShopGodown}
                    onChange={(e) => handleFloorChange(index, e)}
                    required
                  >
                    <option value="">પ્રકાર પસંદ કરો</option>
                    <option value="રૂમ">રૂમ (Room)</option>
                    <option value="હોલ">હોલ (Hall)</option>
                    <option value="દુકાન">દુકાન (Shop)</option>
                    <option value="ગોડાઉન">ગોડાઉન (Godown)</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button type="button" onClick={addFloor} className="add-floor-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          વધુ માળ ઉમેરો
        </button>

        <br />
        <br />

        {/* Field 16: રસોડું */}
        <div className="form-field">
          <label htmlFor="kitchenCount" className="form-label">
            10. રસોડું (કેટલા)
          </label>
          <input
            type="number"
            id="kitchenCount"
            name="kitchenCount"
            className="form-input"
            min="0"
            value={formData.kitchenCount}
            onChange={handleChange}
            required
          />
        </div>

        {/* Field 17: બાથરૂમ */}
        <div className="form-field">
          <label htmlFor="bathroomCount" className="form-label">
            11. બાથરૂમ (કેટલા)
          </label>
          <input
            type="number"
            id="bathroomCount"
            name="bathroomCount"
            className="form-input"
            min="0"
            value={formData.bathroomCount}
            onChange={handleChange}
            required
          />
        </div>

        {/* Field 18: ફરજો */}
        <div className="form-field">
          <label htmlFor="verandaCount" className="form-label">
            13. ફરજો (કેટલા)
          </label>
          <input
            type="number"
            id="verandaCount"
            name="verandaCount"
            className="form-input"
            min="0"
            value={formData.verandaCount}
            onChange={handleChange}
            required
          />
        </div>

        {/* Field 19: નળ */}
        <div className="form-field">
          <label htmlFor="tapCount" className="form-label">
            14. નળ (કેટલા)
          </label>
          <input
            type="number"
            id="tapCount"
            name="tapCount"
            className="form-input"
            min="0"
            value={formData.tapCount}
            onChange={handleChange}
            required
          />
        </div>

        {/* Field 20: શોચાલ્ય */}
        <div className="form-field">
          <label htmlFor="toiletCount" className="form-label">
            15. શોચાલ્ય (કેટલા)
          </label>
          <input
            type="number"
            id="toiletCount"
            name="toiletCount"
            className="form-input"
            min="0"
            value={formData.toiletCount}
            onChange={handleChange}
            required
          />
        </div>

        <br />
        <br />
        {/* Field 21: રીમાર્કસ */}
        <div className="form-field md:col-span-2">
          <label htmlFor="remarks" className="form-label">
            16. રીમાર્કસ/નોંધ
          </label>
          <textarea
            id="remarks"
            name="remarks"
            className="form-textarea"
            rows="3"
            placeholder="કોઈ વધારાની નોંધ..."
            value={formData.remarks}
            onChange={handleChange}
          ></textarea>
        </div>

        <button type="submit" className="submit-button">
          {isEditMode ? "ફોર્મ અપડેટ કરો" : "ફોર્મ સબમિટ કરો"}
        </button>
      </form>
    </div>
  );
};

export default SurvayForm;
