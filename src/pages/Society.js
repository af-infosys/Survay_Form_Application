import React, { useEffect, useState } from "react";

const Society = () => {
  const [societies, setSocieties] = useState([]);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // વિસ્તારો લાવવા માટેનું ફંક્શન
    const fetchAreas = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:4000/api/sheet/areas"); // તમારા બેકએન્ડ રૂટને કૉલ કરો
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setSocieties(result.data); // લાવવામાં આવેલા વિસ્તારોને સ્ટેટમાં સેટ કરો
      } catch (err) {
        console.error("Error fetching areas:", err);
        setError("વિસ્તારો લાવવામાં નિષ્ફળ.");
      } finally {
        setLoading(false);
      }
    };

    fetchAreas(); // વિસ્તારો લાવવા માટે કૉલ કરો
  }, []);

  return (
    <>
      <h2>Manage Society</h2>

      <ul>
        {societies?.map((society) => (
          <li>{society}</li>
        ))}
      </ul>
    </>
  );
};

export default Society;
