import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

function AppLayout({ children }) {
  const [them, setThem] = useState('')
  const location = useLocation();
  useEffect(() => {
    const themColor = JSON.parse(localStorage.getItem('selectedEntity'));
    setThem(themColor?.entity_secondary_color)
    // console.log("them", them?.entity_primary_color)
  }, []);
  const background = `linear-gradient(135deg, ${them}, #fff)`
  const hidebackGround = ['/'].includes(location.pathname)

  return (
    <div className="page-wrapper" style={{ background: hidebackGround ? "" : background }}>
      {children}
    </div>
  );
}

export default React.memo(AppLayout);