import React from "react";

const ExtraVolunteersDish = ({ size = '100px', backgroundColor = '#D9D9D9', children }) => {
  return(
    <div
      style={{
        width: size,
        height: size,
        backgroundColor,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      {children}
    </div>
  );
  
  
};

export default ExtraVolunteersDish;