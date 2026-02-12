import React from 'react'
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

function AppLayout({ children }) {
  const location = useLocation()
  const background = useSelector(
    (state) => state.entity.theme
  );
  const hidebackGround = ['/'].includes(location.pathname)

  return (
    <div className="page-wrapper" style={{ background: hidebackGround ? "" : background }}>
      {children}
    </div>
  );
}

export default React.memo(AppLayout);