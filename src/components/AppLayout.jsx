import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

function AppLayout({ children }) {
  const [them, setThem] = useState('')
  const location = useLocation();
  const selectedEntity = useSelector((state) => state.entity.selected);
  console.log("selectedEntity 1111", selectedEntity?.entity_secondary_color)

  // console.log("selected", selected)
  useEffect(() => {
    const themColor = selectedEntity?.entity_secondary_color || JSON.parse(localStorage.getItem('selectedEntity'));
    setThem(themColor)
    console.log("them", themColor)
  }, [selectedEntity]);

  // useEffect(() => {
  //   const themColor = JSON.parse(localStorage.getItem('selectedEntity'));
  //   setThem(themColor?.entity_secondary_color)
  //   // console.log("them", them?.entity_primary_color)
  // }, []);
  const background = `linear-gradient(135deg, ${them}, #fff)`
  console.log("background",background)
  const hidebackGround = ['/'].includes(location.pathname)

  return (
    <div className="page-wrapper" style={{ background: hidebackGround ? "" : background }}>
      {children}
    </div>
  );
}

export default React.memo(AppLayout);