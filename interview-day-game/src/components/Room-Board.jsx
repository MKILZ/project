import React from "react";

const RoomBoard = ({ width = "200px", height = "200px", backgroundColor = '#D9D9D9', children }) => {
  return(
    <div
      style={{
        width,
        height,
        backgroundColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "8px",
      }}
    >
      {children}
    </div>
  );
  
  
};

export default RoomBoard;
