import React from "react";

const Suggestions = ({
  records = [],
  searchText = "",
  onSelect, // Full sentence select
  onAppend, // Word select
  visible = true,
}) => {
  if (!visible || searchText.trim().length <= 1) return null;

  // ----------------------------
  // Full Suggestions
  // ----------------------------

  const fullSuggestions = [
    ...new Set(
      records
        ?.map((record) => record[3])
        ?.filter(
          (name) =>
            name && name.toLowerCase().includes(searchText.toLowerCase()),
        ),
    ),
  ];

  // ----------------------------
  // Word Suggestions
  // ----------------------------

  const currentWord = searchText.trim().split(" ").pop()?.toLowerCase();

  const wordSuggestions = [
    ...new Set(
      records
        ?.flatMap((record) => record[3]?.trim()?.split(/\s+/) || [])
        ?.filter((word) => word?.toLowerCase().startsWith(currentWord)),
    ),
  ];

  // ----------------------------
  // Handle Word Select
  // ----------------------------

  const handleWordSelect = (word) => {
    const words = searchText.trim().split(" ");

    words[words.length - 1] = word;

    onAppend?.(words.join(" "));
  };

  if (fullSuggestions.length === 0 && wordSuggestions.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        width: "100%",
        maxHeight: "250px",
        overflowY: "auto",
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "8px",
        zIndex: 1000,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      {/* WORD SUGGESTIONS */}

      {wordSuggestions.length > 0 && (
        <>
          {/* <div
            style={{
              padding: "8px 12px",
              fontWeight: "bold",
              background: "#f5f5f5",
              borderBottom: "1px solid #eee",
            }}
          >
            🔤 Word Suggestions
          </div> */}

          {wordSuggestions.map((word) => (
            <div
              key={word}
              onClick={() => handleWordSelect(word)}
              style={{
                padding: "10px 12px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f5f5f5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fff";
              }}
            >
              {word}
            </div>
          ))}
        </>
      )}

      {/* FULL SUGGESTIONS */}

      {fullSuggestions.length > 0 && (
        <>
          {/* <div
            style={{
              padding: "8px 12px",
              fontWeight: "bold",
              background: "#f5f5f5",
              borderBottom: "1px solid #eee",
            }}
          >
            👤 Full Suggestions
          </div> */}

          {fullSuggestions.map((name, index) => (
            <div
              key={index}
              onClick={() => onSelect(name)}
              style={{
                padding: "10px 12px",
                cursor: "pointer",
                borderBottom:
                  index !== fullSuggestions.length - 1
                    ? "1px solid #eee"
                    : "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f5f5f5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fff";
              }}
            >
              {name}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Suggestions;
